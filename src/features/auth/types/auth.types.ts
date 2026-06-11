export interface AuthUser {
  idUser: number;
  nome: string;
  email: string;
  idPerfil: number;
}

export interface AuthState {
  token: string | null;
  usuario: AuthUser | null;
  // true enquanto o silent refresh inicial (na montagem da app) ainda não terminou.
  // Evita que o PrivateRoute redirecione para /login antes de tentar o refresh.
  isInitializing: boolean;
}

// -------------------------------------------------------------------------
// Actions do reducer
// -------------------------------------------------------------------------

export type AuthAction =
  | { type: "LOGIN"; payload: { token: string; usuario: AuthUser } }
  | { type: "SET_TOKEN"; payload: { token: string } }
  | { type: "LOGOUT" }
  | { type: "INITIALIZED" };

// -------------------------------------------------------------------------
// DTOs de requisição para a API
// -------------------------------------------------------------------------

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: AuthUser;
}

export interface SignUpRequest {
  nome: string;
  email: string;
  senha: string;
  idPerfil: number;
}
