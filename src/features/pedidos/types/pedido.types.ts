export const StatusPedido = {
  Pendente: 1,
  Aprovado: 2,
  Rejeitado: 3,
} as const;

export type StatusPedido =
  (typeof StatusPedido)[keyof typeof StatusPedido];

export interface PedidoItem {
  idPedidoItem: number;
  idPiso: number;
  nomePiso: string;
  quantidade: number;
  quantidadeDisponivel: number;
}

export interface Pedido {
  idPedido: number;
  idStatus: StatusPedido;
  status: string;
  nomeSolicitante: string;
  dataCriacao: string;
  motivoRejeicao?: string | null;
  podeAprovar: boolean;
  podeRejeitar: boolean;
  itens: PedidoItem[];
}

export interface PedidoItemSolicitacao {
  idPiso: number;
  quantidade: number;
}

export interface SolicitarPedidoPayload {
  itens: PedidoItemSolicitacao[];
}

export interface PedidoCriado {
  idPedido: number;
  idStatus: StatusPedido;
  status: string;
}

export interface AprovarPedidoFalha {
  idPedido: number;
  motivo: string;
}

export interface AprovarPedidosResultado {
  aprovados: number[];
  falhas: AprovarPedidoFalha[];
}

export interface RejeitarPedidoPayload {
  idPedido: number;
  motivoRejeicao?: string;
}
