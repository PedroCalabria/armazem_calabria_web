import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/auth/useAuth";

/**
 * PrivateRoute — protege rotas que exigem autenticação.
 *
 * Lógica:
 * - isInitializing: o silent refresh ainda está rodando → renderiza null
 *   (tela em branco) para não redirecionar prematuramente para /login
 *   enquanto o token ainda pode ser recuperado via cookie.
 * - isAuthenticated: usuário tem token → renderiza os filhos via <Outlet>
 * - caso contrário: redireciona para /login, preservando a rota original
 *   em `state.from` para redirecionamento pós-login.
 */
export function PrivateRoute() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return null; // ou um componente de loading/spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
