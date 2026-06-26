import { z } from "zod";

export const pedidoItemSchema = z.object({
  idPiso: z.number().min(1, "Selecione um piso"),
  quantidade: z
    .number({ error: "Quantidade é obrigatória" })
    .int("Quantidade deve ser um número inteiro")
    .min(1, "Quantidade deve ser maior que zero"),
});

export const solicitarPedidoSchema = z.object({
  itens: z.array(pedidoItemSchema).min(1, "Informe ao menos um item no pedido"),
});

export type SolicitarPedidoFormValues = z.infer<typeof solicitarPedidoSchema>;
