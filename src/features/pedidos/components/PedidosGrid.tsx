import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useConsultarPedidos } from "@/features/pedidos/hooks/useConsultarPedidos";
import { useAprovarPedido } from "@/features/pedidos/hooks/useAprovarPedido";
import type { Pedido } from "@/features/pedidos/types/pedido.types";
import { StatusPedido } from "@/features/pedidos/types/pedido.types";

interface PedidosGridProps {
  exibirSolicitante: boolean;
  exibirAcoes: boolean;
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  onRejeitar: (idPedido: number) => void;
}

function formatResumoItens(pedido: Pedido): string {
  return pedido.itens
    .map((item) => `${item.nomePiso} (${item.quantidade})`)
    .join(", ");
}

function statusBadgeVariant(
  idStatus: StatusPedido,
): "default" | "secondary" | "destructive" | "outline" {
  switch (idStatus) {
    case StatusPedido.Aprovado:
      return "default";
    case StatusPedido.Rejeitado:
      return "destructive";
    default:
      return "secondary";
  }
}

function pedidoPendente(pedido: Pedido): boolean {
  return Number(pedido.idStatus) === StatusPedido.Pendente;
}

function podeAgirNaLinha(pedido: Pedido, exibirAcoes: boolean): boolean {
  return exibirAcoes && pedidoPendente(pedido);
}

export function PedidosGrid({
  exibirSolicitante,
  exibirAcoes,
  selectedIds,
  onSelectionChange,
  onRejeitar,
}: PedidosGridProps) {
  const { data: pedidos, isLoading, isError } = useConsultarPedidos();
  const { mutate: aprovar, isPending, variables } = useAprovarPedido();

  function toggleSelection(idPedido: number, checked: boolean) {
    if (checked) {
      onSelectionChange([...selectedIds, idPedido]);
    } else {
      onSelectionChange(selectedIds.filter((id) => id !== idPedido));
    }
  }

  function toggleSelectAll(checked: boolean) {
    if (!pedidos) return;

    const pendentes = pedidos
      .filter((p) => podeAgirNaLinha(p, exibirAcoes))
      .map((p) => p.idPedido);

    onSelectionChange(checked ? pendentes : []);
  }

  const pendentesIds =
    pedidos?.filter((p) => podeAgirNaLinha(p, exibirAcoes)).map((p) => p.idPedido) ?? [];

  const allPendentesSelected =
    pendentesIds.length > 0 &&
    pendentesIds.every((id) => selectedIds.includes(id));

  const colSpan =
    5 + (exibirSolicitante ? 1 : 0) + (exibirAcoes ? 2 : 0);

  return (
    <>
      {isLoading && (
        <p className="text-muted-foreground text-sm">Carregando pedidos…</p>
      )}

      {isError && (
        <p className="text-destructive text-sm">
          Erro ao carregar pedidos. Tente novamente.
        </p>
      )}

      {!isLoading && !isError && pedidos && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {exibirAcoes && (
                  <TableHead className="w-10">
                    <Checkbox
                      checked={allPendentesSelected}
                      disabled={pendentesIds.length === 0}
                      onCheckedChange={(checked) =>
                        toggleSelectAll(checked === true)
                      }
                      aria-label="Selecionar todos pendentes"
                    />
                  </TableHead>
                )}
                <TableHead>Nº</TableHead>
                <TableHead>Data</TableHead>
                {exibirSolicitante && <TableHead>Solicitante</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead>Qtd. itens</TableHead>
                <TableHead>Pisos</TableHead>
                {exibirAcoes && (
                  <TableHead className="w-48">Ações</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={colSpan}
                    className="text-center text-muted-foreground"
                  >
                    Nenhum pedido encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                pedidos.map((pedido) => (
                  <TableRow key={pedido.idPedido}>
                    {exibirAcoes && (
                      <TableCell>
                        {podeAgirNaLinha(pedido, exibirAcoes) ? (
                          <Checkbox
                            checked={selectedIds.includes(pedido.idPedido)}
                            onCheckedChange={(checked) =>
                              toggleSelection(
                                pedido.idPedido,
                                checked === true,
                              )
                            }
                            aria-label={`Selecionar pedido ${pedido.idPedido}`}
                          />
                        ) : null}
                      </TableCell>
                    )}
                    <TableCell>#{pedido.idPedido}</TableCell>
                    <TableCell>
                      {new Date(pedido.dataCriacao).toLocaleDateString("pt-BR")}
                    </TableCell>
                    {exibirSolicitante && (
                      <TableCell>{pedido.nomeSolicitante}</TableCell>
                    )}
                    <TableCell>
                      <Badge variant={statusBadgeVariant(pedido.idStatus)}>
                        {pedido.status}
                      </Badge>
                      {pedido.motivoRejeicao && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {pedido.motivoRejeicao}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>{pedido.itens.length}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {formatResumoItens(pedido)}
                    </TableCell>
                    {exibirAcoes && (
                      <TableCell>
                        {podeAgirNaLinha(pedido, exibirAcoes) && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              disabled={
                                isPending && variables === pedido.idPedido
                              }
                              onClick={() => aprovar(pedido.idPedido)}
                            >
                              {isPending && variables === pedido.idPedido
                                ? "Aprovando…"
                                : "Aprovar"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onRejeitar(pedido.idPedido)}
                            >
                              Rejeitar
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
