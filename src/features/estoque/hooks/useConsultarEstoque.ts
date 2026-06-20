import { useQuery } from "@tanstack/react-query";
import { estoqueService } from "@/features/estoque/services/estoqueService";
import type { FiltrosEstoque } from "@/features/estoque/types/estoque.types";

export function useConsultarEstoque(appliedFiltros: FiltrosEstoque) {
  return useQuery({
    queryKey: ["estoque", "consulta", appliedFiltros],
    queryFn: () => estoqueService.consultarEstoque(appliedFiltros),
  });
}
