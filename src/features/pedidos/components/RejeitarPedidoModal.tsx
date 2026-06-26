import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRejeitarPedido } from "@/features/pedidos/hooks/useRejeitarPedido";

interface RejeitarPedidoModalProps {
  idPedido: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RejeitarPedidoModal({
  idPedido,
  open,
  onOpenChange,
}: RejeitarPedidoModalProps) {
  const [motivo, setMotivo] = useState("");
  const { mutate: rejeitar, isPending } = useRejeitarPedido();

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      setMotivo("");
    }
    onOpenChange(nextOpen);
  }

  function handleConfirm() {
    if (idPedido === null) return;

    rejeitar(
      { idPedido, motivoRejeicao: motivo.trim() || undefined },
      {
        onSuccess: () => handleClose(false),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rejeitar pedido #{idPedido}</DialogTitle>
          <DialogDescription>
            Informe opcionalmente o motivo da rejeição.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="motivo-rejeicao">Motivo (opcional)</Label>
          <Input
            id="motivo-rejeicao"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ex.: Itens indisponíveis no momento"
            maxLength={500}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Rejeitando…" : "Confirmar rejeição"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
