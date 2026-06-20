import { useCallback, useState } from "react";
import type { FiltrosEstoque } from "@/features/estoque/types/estoque.types";
import {
  clearFiltros,
  emptyFiltros,
  loadFiltros,
  saveFiltros,
} from "@/features/estoque/utils/estoqueFiltrosStorage";

function getInitialFiltros(): FiltrosEstoque {
  return loadFiltros() ?? emptyFiltros();
}

export function useEstoqueFiltros() {
  const [draftFiltros, setDraftFiltros] = useState<FiltrosEstoque>(
    getInitialFiltros,
  );
  const [appliedFiltros, setAppliedFiltros] = useState<FiltrosEstoque>(
    getInitialFiltros,
  );

  const updateDraft = useCallback(
    (field: keyof FiltrosEstoque, value: number[]) => {
      setDraftFiltros((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const pesquisar = useCallback(() => {
    saveFiltros(draftFiltros);
    setAppliedFiltros(draftFiltros);
  }, [draftFiltros]);

  const limpar = useCallback(() => {
    const empty = emptyFiltros();
    clearFiltros();
    setDraftFiltros(empty);
    setAppliedFiltros(empty);
  }, []);

  return {
    draftFiltros,
    appliedFiltros,
    updateDraft,
    pesquisar,
    limpar,
  };
}
