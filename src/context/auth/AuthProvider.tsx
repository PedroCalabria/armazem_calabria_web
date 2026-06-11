import { useReducer, useMemo, useEffect, type ReactNode } from "react";
import { AuthStateContext, AuthDispatchContext } from "./AuthContext";
import {
  authReducer,
  initialAuthState,
} from "@/features/auth/store/authReducer";
import { registerAuthCallbacks } from "@/api/interceptors/auth.interceptor";
import { authService } from "@/features/auth/services/authService";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider — envolve toda a aplicação e provê o estado de autenticação.
 *
 * Responsabilidades:
 * 1. Inicializa o reducer com estado vazio (token em memória, não localStorage).
 * 2. Registra os callbacks no interceptor Axios para que ele possa ler/atualizar
 *    o token sem criar dependência circular com o contexto React.
 * 3. Executa o Silent Refresh na montagem: tenta renovar o token usando o
 *    cookie HttpOnly. Se bem-sucedido, popula o estado; senão, marca como
 *    inicializado (token=null → PrivateRoute redireciona para /login).
 *
 * useMemo nos valores dos contextos:
 * Evita que todos os consumidores re-renderizem quando o AuthProvider
 * re-renderiza por razões externas (pai re-renderizou). O valor do contexto
 * só muda quando state ou dispatch mudam de fato.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Registra os callbacks para o interceptor Axios acessar o token
  // sem precisar importar o contexto React (evita dependência circular).
  useEffect(() => {
    registerAuthCallbacks(
      () => state.token,
      (token) => dispatch({ type: "SET_TOKEN", payload: { token } }),
      () => dispatch({ type: "LOGOUT" }),
    );
  }, [state.token]);

  // Silent Refresh: tenta recuperar a sessão ao montar a aplicação.
  // O cookie HttpOnly é enviado automaticamente (withCredentials: true no Axios).
  useEffect(() => {
    authService
      .refreshToken()
      .then(({ token, usuario }) => {
        dispatch({ type: "LOGIN", payload: { token, usuario } });
      })
      .catch(() => {
        // Sem sessão válida — apenas marca como inicializado.
        // O PrivateRoute cuidará do redirecionamento para /login.
        dispatch({ type: "INITIALIZED" });
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const stateValue = useMemo(() => state, [state]);

  return (
    <AuthStateContext.Provider value={stateValue}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}
