export interface OpcaoFiltro {
  chave: number;
  descricao: string;
}

export interface OpcoesFiltroEstoque {
  tiposPiso: OpcaoFiltro[];
  marcas: OpcaoFiltro[];
  niveisResistencia: OpcaoFiltro[];
  ambientes: OpcaoFiltro[];
  acabamentos: OpcaoFiltro[];
}

export interface FiltrosEstoque {
  tipoPiso: number[];
  marca: number[];
  nivelResistencia: number[];
  ambiente: number[];
  acabamento: number[];
}

export interface ItemEstoque {
  idPiso: number;
  idTipoPiso: number;
  nome: string;
  cor: string;
  preco: number;
  quantidadeDisponivel: number;
  tipoPiso: string;
  marca: string;
  nivelResistencia: string;
  ambiente: string;
  acabamento: string;
  classePei: number;
  flagRetificado: boolean;
  tipoPorcelanato: string;
  flagAcustico: boolean;
  tipoInstalacao: string;
  flagResistenteCupim: boolean;
  tipoMadeira: string;
  flagMadeiraNobre: boolean;
  tipoPedra: string;
  flagPorosidade: boolean;
  flagNecessitaImpermeabilizacao: boolean;
}
