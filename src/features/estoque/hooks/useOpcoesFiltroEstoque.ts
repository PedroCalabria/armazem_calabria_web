import { useQuery } from "@tanstack/react-query";
import { estoqueService } from "@/features/estoque/services/estoqueService";

export const OPCOES_FILTRO_ESTOQUE_KEY = ["estoque", "opcoes-filtro"] as const;

export function useOpcoesFiltroEstoque() {
  return useQuery({
    queryKey: OPCOES_FILTRO_ESTOQUE_KEY,
    queryFn: estoqueService.obterOpcoesFiltro,
  });
}
