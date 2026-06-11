import { useUsuariosPendentes } from "@/features/usuarios/hooks/useUsuariosPendentes";
import { useAutorizarUsuario } from "@/features/usuarios/hooks/useAutorizarUsuario";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function AprovarUsuariosPage() {
  const { data: usuarios, isLoading, isError } = useUsuariosPendentes();
  const { mutate: autorizar, isPending, variables } = useAutorizarUsuario();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Aprovar Usuários</h1>
      <p className="mt-2 mb-6 text-muted-foreground">
        Gerencie as solicitações de cadastro pendentes.
      </p>

      {isLoading && (
        <p className="text-muted-foreground text-sm">Carregando usuários…</p>
      )}

      {isError && (
        <p className="text-destructive text-sm">
          Erro ao carregar usuários. Tente novamente.
        </p>
      )}

      {!isLoading && !isError && usuarios && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead className="w-32">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    Nenhum usuário aguardando aprovação.
                  </TableCell>
                </TableRow>
              ) : (
                usuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>{usuario.nome}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>
                      {new Date(usuario.dataCriacao).toLocaleDateString(
                        "pt-BR",
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        disabled={isPending && variables === usuario.email}
                        onClick={() => autorizar(usuario.email)}
                      >
                        {isPending && variables === usuario.email
                          ? "Autorizando…"
                          : "Autorizar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </main>
  );
}
