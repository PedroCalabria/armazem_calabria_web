import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import axios from "axios";
import { isTokenExpiringSoon } from "@/lib/jwt";

/**
 * Módulo central de autenticação no nível HTTP.
 *
 * Implementa dois mecanismos complementares de refresh token:
 *
 * 1. PROATIVO (Request Interceptor):
 *    Antes de cada requisição, verifica se o access token vai expirar
 *    nos próximos 30 segundos. Se sim, faz refresh ANTES de enviar.
 *    Evita requisições desnecessariamente com 401.
 *
 * 2. REATIVO (Response Interceptor):
 *    Se mesmo assim chegar um 401 (race condition, diferença de relógio),
 *    faz o refresh e reprocessa a requisição original automaticamente.
 *
 * FILA DE REQUISIÇÕES PENDENTES:
 *    Se múltiplas requisições chegam simultaneamente com token expirado,
 *    apenas UMA chamada de refresh é feita. As demais ficam em fila e
 *    são liberadas (ou rejeitadas) quando o refresh termina.
 *    Sem isso, o servidor receberia múltiplos refreshes simultâneos,
 *    podendo invalidar tokens ainda válidos dependendo da implementação.
 */

// Funções para obter/setar token acessadas via callbacks para evitar
// dependência circular (o interceptor não pode importar o AuthContext diretamente,
// pois o contexto é React e vive fora da camada de API).
type TokenGetter = () => string | null;
type TokenSetter = (token: string) => void;
type LogoutCallback = () => void;

let getToken: TokenGetter = () => null;
let setToken: TokenSetter = () => {};
let onLogout: LogoutCallback = () => {};

/**
 * Registra os callbacks do AuthContext neste módulo.
 * Chamado uma vez durante a inicialização do AuthProvider.
 */
export function registerAuthCallbacks(
  getter: TokenGetter,
  setter: TokenSetter,
  logout: LogoutCallback,
) {
  getToken = getter;
  setToken = setter;
  onLogout = logout;
}

// --- Fila de requisições pendentes durante um refresh em andamento ---
let isRefreshing = false;
type PendingResolver = (token: string) => void;
type PendingRejector = (error: unknown) => void;
const pendingQueue: Array<{
  resolve: PendingResolver;
  reject: PendingRejector;
}> = [];

function processQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error || !token) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  pendingQueue.length = 0;
}

// --- Função de refresh isolada (sem passar pela instância principal para evitar loop) ---
async function callRefreshToken(): Promise<string> {
  const response = await axios.post<{ token: string }>(
    `${import.meta.env.VITE_API_BASE_URL ?? ""}/api/login/refreshtoken`,
    {},
    { withCredentials: true }, // envia o cookie HttpOnly automaticamente
  );
  return response.data.token;
}

// --- Registra os dois interceptors na instância Axios ---
export function attachAuthInterceptors(instance: AxiosInstance) {
  // =====================================================================
  // REQUEST INTERCEPTOR — Refresh Proativo
  // =====================================================================
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = getToken();

      if (token) {
        if (isTokenExpiringSoon(token)) {
          // Token vai expirar em breve: refresh antes de enviar a requisição
          if (!isRefreshing) {
            isRefreshing = true;
            try {
              const newToken = await callRefreshToken();
              setToken(newToken);
              processQueue(null, newToken);
              config.headers.Authorization = `Bearer ${newToken}`;
            } catch (err) {
              processQueue(err, null);
              onLogout();
              return Promise.reject(err);
            } finally {
              isRefreshing = false;
            }
          } else {
            // Outro refresh já está em andamento: entra na fila
            const freshToken = await new Promise<string>((resolve, reject) => {
              pendingQueue.push({ resolve, reject });
            });
            config.headers.Authorization = `Bearer ${freshToken}`;
          }
        } else {
          // Token ainda válido: injeta normalmente
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  // =====================================================================
  // RESPONSE INTERCEPTOR — Refresh Reativo (fallback para 401 inesperado)
  // =====================================================================
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      const is401 = error.response?.status === 401;
      const alreadyRetried = originalRequest._retry === true;
      const isRefreshEndpoint = originalRequest.url?.includes("/refreshtoken");

      if (is401 && !alreadyRetried && !isRefreshEndpoint) {
        originalRequest._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const newToken = await callRefreshToken();
            setToken(newToken);
            processQueue(null, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            onLogout();
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        // Outro refresh já em andamento: entra na fila e aguarda
        return new Promise<unknown>((resolve, reject) => {
          pendingQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(instance(originalRequest));
            },
            reject,
          });
        });
      }

      return Promise.reject(error);
    },
  );
}
