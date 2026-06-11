import { useContext } from "react";
import { AuthStateContext, AuthDispatchContext } from "./AuthContext";
import type { AuthUser } from "@/features/auth/types/auth.types";
import type { TiposPerfil } from "@/lib/enums/tiposPerfil.enum";

/**
 * useAuthState — acessa os dados do estado de autenticação.
 * Use em componentes que precisam ler token, user ou isInitializing.
 */
export function useAuthState() {
  return useContext(AuthStateContext);
}

/**
 * useAuthDispatch — acessa o dispatch do reducer.
 * Use em componentes que só precisam disparar ações (ex.: botão de logout).
 * Não re-renderiza quando o estado muda.
 */
export function useAuthDispatch() {
  return useContext(AuthDispatchContext);
}

/**
 * useAuth — hook de conveniência que combina estado e ações derivadas.
 * Use quando precisar de múltiplas informações do contexto de auth.
 */
export function useAuth() {
  const state = useAuthState();
  const dispatch = useAuthDispatch();

  const isAuthenticated = state.token !== null && state.usuario !== null;

  function hasRole(...roles: TiposPerfil[]): boolean {
    if (!state.usuario) return false;
    return roles.includes(state.usuario.idPerfil as TiposPerfil);
  }

  function logout() {
    dispatch({ type: "LOGOUT" });
  }

  function setUser(token: string, usuario: AuthUser) {
    dispatch({ type: "LOGIN", payload: { token, usuario } });
  }

  return {
    token: state.token,
    usuario: state.usuario,
    isAuthenticated,
    isInitializing: state.isInitializing,
    hasRole,
    logout,
    setUser,
  };
}
