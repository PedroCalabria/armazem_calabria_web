import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { pedidoService } from "../services/pedidoService";
import { PEDIDOS_KEY } from "./useConsultarPedidos";

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error) && error.response?.data?.error) {
    return error.response.data.error as string;
  }
  return "Não foi possível aprovar os pedidos. Tente novamente.";
}

export function useAprovarPedidosLote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idsPedidos: number[]) =>
      pedidoService.aprovarPedidos(idsPedidos),
    onSuccess: (resultado) => {
      queryClient.invalidateQueries({ queryKey: PEDIDOS_KEY });
      queryClient.invalidateQueries({ queryKey: ["estoque"] });

      const { aprovados, falhas } = resultado;

      if (aprovados.length > 0 && falhas.length === 0) {
        toast.success(
          aprovados.length === 1
            ? "Pedido aprovado com sucesso."
            : `${aprovados.length} pedidos aprovados com sucesso.`,
        );
      } else if (aprovados.length > 0 && falhas.length > 0) {
        const detalhes = falhas
          .map((f) => `#${f.idPedido}: ${f.motivo}`)
          .join("; ");
        toast.warning(
          `${aprovados.length} aprovado(s), ${falhas.length} falha(s). ${detalhes}`,
        );
      } else if (falhas.length > 0) {
        const detalhes = falhas
          .map((f) => `#${f.idPedido}: ${f.motivo}`)
          .join("; ");
        toast.error(`Nenhum pedido aprovado. ${detalhes}`);
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
