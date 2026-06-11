import type { AuthState, AuthAction } from "../types/auth.types";

export const initialAuthState: AuthState = {
  token: null,
  usuario: null,
  isInitializing: true, // começa como true até o silent refresh ser concluído
};

/**
 * Reducer central do estado de autenticação.
 *
 * Concentra todas as transições de estado em um único lugar,
 * tornando o fluxo de auth previsível e fácil de depurar.
 *
 * Transições:
 *  LOGIN       → usuário autenticou com sucesso (login ou silent refresh com dados)
 *  SET_TOKEN   → novo access token gerado pelo refresh (sem alterar dados do usuário)
 *  LOGOUT      → limpa tudo; interceptor redirecionará para /login
 *  INITIALIZED → silent refresh terminou (com ou sem sucesso); libera o PrivateRoute
 */
export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return {
        token: action.payload.token,
        usuario: action.payload.usuario,
        isInitializing: false,
      };

    case "SET_TOKEN":
      return {
        ...state,
        token: action.payload.token,
      };

    case "LOGOUT":
      return {
        token: null,
        usuario: null,
        isInitializing: false,
      };

    case "INITIALIZED":
      // Marcamos que o processo de inicialização terminou sem alterar token/user.
      // Usado quando o refresh falha (nenhum cookie válido): simplesmente
      // deixamos token=null e paramos de bloquear a navegação.
      return {
        ...state,
        isInitializing: false,
      };

    default:
      return state;
  }
}
