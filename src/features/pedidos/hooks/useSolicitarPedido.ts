import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { pedidoService } from "../services/pedidoService";
import type { SolicitarPedidoPayload } from "../types/pedido.types";
import { StatusPedido } from "../types/pedido.types";
import { PEDIDOS_KEY } from "./useConsultarPedidos";

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error) && error.response?.data?.error) {
    return error.response.data.error as string;
  }
  return "Não foi possível solicitar o pedido. Tente novamente.";
}

export function useSolicitarPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SolicitarPedidoPayload) =>
      pedidoService.solicitarPedido(payload),
    onSuccess: (pedido) => {
      queryClient.invalidateQueries({ queryKey: PEDIDOS_KEY });
      queryClient.invalidateQueries({ queryKey: ["estoque"] });

      if (pedido.idStatus === StatusPedido.Aprovado) {
        toast.success("Pedido aprovado automaticamente por disponibilidade de estoque.");
      } else {
        toast.success("Pedido registrado como pendente. Aguardando aprovação.");
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
