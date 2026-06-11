import api from "@/api/axios";
import type {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  AuthUser,
} from "../types/auth.types";

/**
 * authService — funções puras de acesso à API de autenticação.
 *
 * Sem estado. Sem contexto React. Apenas chamadas HTTP.
 * O estado resultante é gerenciado pelos hooks (useLogin, etc.)
 * que chamam essas funções e fazem dispatch para o AuthContext.
 */
export const authService = {
  /**
   * POST /api/Login/login
   * Autentica o usuário e recebe o access token JWT.
   * O refresh token é definido pelo servidor como cookie HttpOnly
   * (não acessível pelo JS — protegido contra XSS).
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log("Enviando requisição de login com:", credentials); // Log para depuração
    const { data } = await api.post<LoginResponse>(
      "/api/Login/login",
      credentials,
    );
    console.log("Resposta recebida do login:", data); // Log para depuração
    return data;
  },

  /**
   * POST /api/Login/refreshtoken
   * O cookie HttpOnly é enviado automaticamente pelo browser (withCredentials: true).
   * Retorna um novo access token e os dados do usuário.
   * Usado tanto pelo silent refresh na inicialização quanto pelo interceptor.
   */
  async refreshToken(): Promise<{ token: string; usuario: AuthUser }> {
    const { data } = await api.post<{ token: string; usuario: AuthUser }>(
      "/api/Login/refreshtoken",
    );
    return data;
  },

  /**
   * POST /api/Login/signUp
   * Registra um novo usuário. Dados sensíveis (email, senha) são protegidos
   * pelo TLS/HTTPS em trânsito. Nunca faça hash no cliente — o servidor usa
   * bcrypt/argon2 com salt, o que requer a senha original.
   *
   * SEGURANÇA: o campo `role` é enviado ao servidor, mas o backend DEVE
   * validar e não confiar cegamente nele (ex.: novos usuários Gestor
   * ficam pendentes de aprovação por outro Gestor).
   */
  async signUp(data: SignUpRequest): Promise<void> {
    await api.post("/api/Login/signUp", data);
  },

  /**
   * POST /api/Login/logout
   * Invalida o refresh token no servidor e limpa o cookie HttpOnly.
   */
  async logout(): Promise<void> {
    await api.post("/api/Login/logout");
  },
};
