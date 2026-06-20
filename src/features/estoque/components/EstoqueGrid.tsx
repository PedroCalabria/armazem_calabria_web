import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConsultarEstoque } from "@/features/estoque/hooks/useConsultarEstoque";
import type {
  FiltrosEstoque,
  ItemEstoque,
} from "@/features/estoque/types/estoque.types";

interface EstoqueGridProps {
  appliedFiltros: FiltrosEstoque;
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatBoolean(value: boolean): string {
  return value ? "Sim" : "Não";
}

function formatText(value: string | null | undefined): string {
  return value && value.trim().length > 0 ? value : "—";
}

const COLUMNS: {
  key: keyof ItemEstoque;
  label: string;
  render: (item: ItemEstoque) => string | number;
}[] = [
  { key: "nome", label: "Nome", render: (item) => formatText(item.nome) },
  { key: "cor", label: "Cor", render: (item) => formatText(item.cor) },
  {
    key: "preco",
    label: "Preço",
    render: (item) => currencyFormatter.format(item.preco),
  },
  {
    key: "quantidadeDisponivel",
    label: "Qtd. Disponível",
    render: (item) => item.quantidadeDisponivel,
  },
  {
    key: "tipoPiso",
    label: "Tipo Piso",
    render: (item) => formatText(item.tipoPiso),
  },
  { key: "marca", label: "Marca", render: (item) => formatText(item.marca) },
  {
    key: "nivelResistencia",
    label: "Nível Resistência",
    render: (item) => formatText(item.nivelResistencia),
  },
  {
    key: "ambiente",
    label: "Ambiente",
    render: (item) => formatText(item.ambiente),
  },
  {
    key: "acabamento",
    label: "Acabamento",
    render: (item) => formatText(item.acabamento),
  },
  { key: "classePei", label: "Classe PEI", render: (item) => item.classePei },
  {
    key: "flagRetificado",
    label: "Retificado",
    render: (item) => formatBoolean(item.flagRetificado),
  },
  {
    key: "tipoPorcelanato",
    label: "Tipo Porcelanato",
    render: (item) => formatText(item.tipoPorcelanato),
  },
  {
    key: "flagAcustico",
    label: "Acústico",
    render: (item) => formatBoolean(item.flagAcustico),
  },
  {
    key: "tipoInstalacao",
    label: "Tipo Instalação",
    render: (item) => formatText(item.tipoInstalacao),
  },
  {
    key: "flagResistenteCupim",
    label: "Resistente Cupim",
    render: (item) => formatBoolean(item.flagResistenteCupim),
  },
  {
    key: "tipoMadeira",
    label: "Tipo Madeira",
    render: (item) => formatText(item.tipoMadeira),
  },
  {
    key: "flagMadeiraNobre",
    label: "Madeira Nobre",
    render: (item) => formatBoolean(item.flagMadeiraNobre),
  },
  {
    key: "tipoPedra",
    label: "Tipo Pedra",
    render: (item) => formatText(item.tipoPedra),
  },
  {
    key: "flagPorosidade",
    label: "Porosidade",
    render: (item) => formatBoolean(item.flagPorosidade),
  },
  {
    key: "flagNecessitaImpermeabilizacao",
    label: "Necessita Impermeabilização",
    render: (item) => formatBoolean(item.flagNecessitaImpermeabilizacao),
  },
];

export function EstoqueGrid({ appliedFiltros }: EstoqueGridProps) {
  const { data: itens, isLoading, isError } = useConsultarEstoque(appliedFiltros);

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Carregando estoque…</p>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        Erro ao carregar estoque. Tente novamente.
      </p>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {COLUMNS.map((column) => (
              <TableHead key={column.key} className="whitespace-nowrap">
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {!itens || itens.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={COLUMNS.length}
                className="text-center text-muted-foreground"
              >
                Nenhum item encontrado.
              </TableCell>
            </TableRow>
          ) : (
            itens.map((item) => (
              <TableRow key={item.idPiso}>
                {COLUMNS.map((column) => (
                  <TableCell key={column.key} className="whitespace-nowrap">
                    {column.render(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
