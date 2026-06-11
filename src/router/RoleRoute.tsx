import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/auth/useAuth";
import type { UserRole } from "@/features/auth/types/auth.types";

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

/**
 * RoleRoute — protege rotas que exigem perfis específicos.
 *
 * Deve ser aninhado dentro de um PrivateRoute (o usuário já é autenticado).
 * Se o perfil não for permitido, redireciona para /unauthorized.
 *
 * Uso:
 * <Route element={<RoleRoute allowedRoles={['Gestor', 'LojistaInterno']} />}>
 *   <Route path="/orders" element={<OrdersPage />} />
 * </Route>
 */
export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { hasRole } = useAuth();

  if (!hasRole(...allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
