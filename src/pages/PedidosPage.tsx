import { useState } from "react";
import { useAuth } from "@/context/auth/useAuth";
import { TiposPerfil } from "@/lib/enums/tiposPerfil.enum";
import { Button } from "@/components/ui/button";
import { PedidosGrid } from "@/features/pedidos/components/PedidosGrid";
import { SolicitarPedidoModal } from "@/features/pedidos/components/SolicitarPedidoModal";
import { RejeitarPedidoModal } from "@/features/pedidos/components/RejeitarPedidoModal";
import { useAprovarPedidosLote } from "@/features/pedidos/hooks/useAprovarPedidosLote";

export function PedidosPage() {
  const { hasRole } = useAuth();
  const [modalSolicitarAberto, setModalSolicitarAberto] = useState(false);
  const [pedidoRejeitar, setPedidoRejeitar] = useState<number | null>(null);
  const [modalRejeitarAberto, setModalRejeitarAberto] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const isLojistaExterno = hasRole(TiposPerfil.LojistaExterno);
  const podeGerenciar = hasRole(
    TiposPerfil.Gestor,
    TiposPerfil.LojistaInterno,
  );

  const { mutate: aprovarLote, isPending: aprovandoLote } =
    useAprovarPedidosLote();

  function handleRejeitar(idPedido: number) {
    setPedidoRejeitar(idPedido);
    setModalRejeitarAberto(true);
  }

  function handleAprovarSelecionados() {
    aprovarLote(selectedIds, {
      onSuccess: () => setSelectedIds([]),
    });
  }

  return (
    <main className="p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Consultar / Cadastrar Pedidos</h1>
          <p className="mt-2 text-muted-foreground">
            {isLojistaExterno
              ? "Consulte seus pedidos ou solicite um novo."
              : "Visualize e gerencie os pedidos do sistema."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {podeGerenciar && (
            <Button
              disabled={selectedIds.length === 0 || aprovandoLote}
              onClick={handleAprovarSelecionados}
            >
              {aprovandoLote
                ? "Aprovando…"
                : `Aprovar selecionados (${selectedIds.length})`}
            </Button>
          )}

          {isLojistaExterno && (
            <Button onClick={() => setModalSolicitarAberto(true)}>
              Solicitar novo pedido
            </Button>
          )}
        </div>
      </div>

      <PedidosGrid
        exibirSolicitante={!isLojistaExterno}
        exibirAcoes={podeGerenciar}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onRejeitar={handleRejeitar}
      />

      {isLojistaExterno && (
        <SolicitarPedidoModal
          open={modalSolicitarAberto}
          onOpenChange={setModalSolicitarAberto}
        />
      )}

      {podeGerenciar && (
        <RejeitarPedidoModal
          idPedido={pedidoRejeitar}
          open={modalRejeitarAberto}
          onOpenChange={setModalRejeitarAberto}
        />
      )}
    </main>
  );
}
