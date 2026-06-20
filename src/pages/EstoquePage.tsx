import { EstoqueFiltros } from "@/features/estoque/components/EstoqueFiltros";
import { EstoqueGrid } from "@/features/estoque/components/EstoqueGrid";
import { useEstoqueFiltros } from "@/features/estoque/hooks/useEstoqueFiltros";

export function EstoquePage() {
  const {
    draftFiltros,
    appliedFiltros,
    updateDraft,
    pesquisar,
    limpar,
  } = useEstoqueFiltros();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Gerenciar Estoque</h1>
      <p className="mt-2 mb-6 text-muted-foreground">
        Visualize e atualize os itens em estoque.
      </p>

      <EstoqueFiltros
        draftFiltros={draftFiltros}
        onUpdateDraft={updateDraft}
        onPesquisar={pesquisar}
        onLimpar={limpar}
      />

      <EstoqueGrid appliedFiltros={appliedFiltros} />
    </main>
  );
}
