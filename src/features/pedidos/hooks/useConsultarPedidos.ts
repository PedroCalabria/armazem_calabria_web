import { useQuery } from "@tanstack/react-query";
import { pedidoService } from "../services/pedidoService";

export const PEDIDOS_KEY = ["pedidos"] as const;

export function useConsultarPedidos() {
  return useQuery({
    queryKey: PEDIDOS_KEY,
    queryFn: () => pedidoService.consultarPedidos(),
  });
}
