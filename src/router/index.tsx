import { createBrowserRouter, Navigate } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoginPage } from "@/pages/LoginPage";
import { SignUpPage } from "@/pages/SignUpPage";
import { AprovarUsuariosPage } from "@/pages/AprovarUsuariosPage";
import { EstoquePage } from "@/pages/EstoquePage";
import { PedidosPage } from "@/pages/PedidosPage";
import { UnauthorizedPage } from "@/pages/UnauthorizedPage";

/**
 * Definição centralizada de todas as rotas da aplicação.
 *
 * Estrutura:
 * - Rotas públicas (/login, /signup): acessíveis sem autenticação
 * - Rotas privadas: aninhadas sob PrivateRoute (verificação de token)
 * - Rotas por perfil: aninhadas adicionalmente sob RoleRoute (fases futuras)
 *
 * createBrowserRouter é preferível ao BrowserRouter + Routes porque:
 * - Suporta data loading (loaders/actions) do React Router v6.4+
 * - Melhor separação entre configuração de rotas e renderização
 * - Facilita testes unitários das rotas
 */
export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    // Todas as rotas protegidas ficam aninhadas aqui
    element: <PrivateRoute />,
    children: [
      {
        // AppLayout injeta a Sidebar em todas as rotas filhas
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/estoque" replace />,
          },
          {
            path: "/aprovar-usuarios",
            element: <AprovarUsuariosPage />,
          },
          {
            path: "/estoque",
            element: <EstoquePage />,
          },
          {
            path: "/pedidos",
            element: <PedidosPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
