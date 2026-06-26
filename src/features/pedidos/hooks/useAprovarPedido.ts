import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { pedidoService } from "../services/pedidoService";
import { PEDIDOS_KEY } from "./useConsultarPedidos";

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error) && error.response?.data?.error) {
    return error.response.data.error as string;
  }
  return "Não foi possível aprovar o pedido. Tente novamente.";
}

export function useAprovarPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idPedido: number) => pedidoService.aprovarPedido(idPedido),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PEDIDOS_KEY });
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
      toast.success("Pedido aprovado com sucesso.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
