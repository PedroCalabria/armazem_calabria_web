import api from "@/api/axios";
import type {
  AprovarPedidosResultado,
  Pedido,
  PedidoCriado,
  RejeitarPedidoPayload,
  SolicitarPedidoPayload,
} from "@/features/pedidos/types/pedido.types";

export const pedidoService = {
  async consultarPedidos(): Promise<Pedido[]> {
    const { data } = await api.get<Pedido[]>("/api/Pedido/consultarPedidos");
    return data;
  },

  async solicitarPedido(payload: SolicitarPedidoPayload): Promise<PedidoCriado> {
    const { data } = await api.post<PedidoCriado>(
      "/api/Pedido/solicitarPedido",
      payload,
    );
    return data;
  },

  async aprovarPedido(idPedido: number): Promise<void> {
    await api.post("/api/Pedido/aprovarPedido", null, {
      params: { idPedido },
    });
  },

  async aprovarPedidos(idsPedidos: number[]): Promise<AprovarPedidosResultado> {
    const { data } = await api.post<AprovarPedidosResultado>(
      "/api/Pedido/aprovarPedidos",
      { idsPedidos },
    );
    return data;
  },

  async rejeitarPedido(payload: RejeitarPedidoPayload): Promise<void> {
    await api.post("/api/Pedido/rejeitarPedido", payload);
  },
};
