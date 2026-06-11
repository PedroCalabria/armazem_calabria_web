import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/context/auth/AuthProvider'
import { router } from '@/router'

/**
 * QueryClient — instância global do TanStack Query.
 * - staleTime: 5 min → dados em cache são considerados "frescos" por 5 min
 *   (evita refetches desnecessários ao re-focar a aba)
 * - retry: 1 → em caso de erro, tenta novamente apenas 1 vez
 *   (o interceptor já lida com 401; não queremos loops)
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

/**
 * App — raiz da aplicação.
 *
 * Ordem dos providers (de fora para dentro):
 * 1. QueryClientProvider: disponibiliza o cache do TanStack Query
 * 2. AuthProvider: inicializa o contexto de auth + executa o silent refresh
 * 3. RouterProvider: renderiza as rotas (PrivateRoute depende do AuthProvider)
 * 4. Toaster: notificações globais (sonner) fora da árvore de rotas
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
