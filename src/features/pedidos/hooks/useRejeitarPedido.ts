import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { pedidoService } from "../services/pedidoService";
import type { RejeitarPedidoPayload } from "../types/pedido.types";
import { PEDIDOS_KEY } from "./useConsultarPedidos";

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error) && error.response?.data?.error) {
    return error.response.data.error as string;
  }
  return "Não foi possível rejeitar o pedido. Tente novamente.";
}

export function useRejeitarPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RejeitarPedidoPayload) =>
      pedidoService.rejeitarPedido(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PEDIDOS_KEY });
      toast.success("Pedido rejeitado.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
