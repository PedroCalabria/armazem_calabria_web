import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import { useOpcoesFiltroEstoque } from "@/features/estoque/hooks/useOpcoesFiltroEstoque";
import type { FiltrosEstoque } from "@/features/estoque/types/estoque.types";

interface EstoqueFiltrosProps {
  draftFiltros: FiltrosEstoque;
  onUpdateDraft: (field: keyof FiltrosEstoque, value: number[]) => void;
  onPesquisar: () => void;
  onLimpar: () => void;
}

export function EstoqueFiltros({
  draftFiltros,
  onUpdateDraft,
  onPesquisar,
  onLimpar,
}: EstoqueFiltrosProps) {
  const { data: opcoes, isLoading, isError } = useOpcoesFiltroEstoque();

  return (
    <section className="mb-6 rounded-md border p-4">
      <h2 className="mb-4 text-lg font-semibold">Filtros</h2>

      {isError && (
        <p className="mb-4 text-sm text-destructive">
          Erro ao carregar opções de filtro. Tente novamente.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MultiSelect
          label="Tipo Piso"
          options={opcoes?.tiposPiso ?? []}
          value={draftFiltros.tipoPiso}
          onChange={(value) => onUpdateDraft("tipoPiso", value)}
          disabled={isLoading || isError}
        />
        <MultiSelect
          label="Marca"
          options={opcoes?.marcas ?? []}
          value={draftFiltros.marca}
          onChange={(value) => onUpdateDraft("marca", value)}
          disabled={isLoading || isError}
        />
        <MultiSelect
          label="Nível Resistência"
          options={opcoes?.niveisResistencia ?? []}
          value={draftFiltros.nivelResistencia}
          onChange={(value) => onUpdateDraft("nivelResistencia", value)}
          disabled={isLoading || isError}
        />
        <MultiSelect
          label="Ambiente"
          options={opcoes?.ambientes ?? []}
          value={draftFiltros.ambiente}
          onChange={(value) => onUpdateDraft("ambiente", value)}
          disabled={isLoading || isError}
        />
        <MultiSelect
          label="Acabamento"
          options={opcoes?.acabamentos ?? []}
          value={draftFiltros.acabamento}
          onChange={(value) => onUpdateDraft("acabamento", value)}
          disabled={isLoading || isError}
        />
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onLimpar}>
          Limpar
        </Button>
        <Button onClick={onPesquisar} disabled={isLoading || isError}>
          Pesquisar
        </Button>
      </div>
    </section>
  );
}
