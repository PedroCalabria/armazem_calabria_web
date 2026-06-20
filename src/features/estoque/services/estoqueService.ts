import api from "@/api/axios";
import type {
  FiltrosEstoque,
  ItemEstoque,
  OpcoesFiltroEstoque,
} from "@/features/estoque/types/estoque.types";

function buildQueryParams(filtros: FiltrosEstoque): Record<string, number[]> {
  const params: Record<string, number[]> = {};

  if (filtros.tipoPiso.length > 0) {
    params.TipoPiso = filtros.tipoPiso;
  }
  if (filtros.marca.length > 0) {
    params.Marca = filtros.marca;
  }
  if (filtros.nivelResistencia.length > 0) {
    params.NivelResistencia = filtros.nivelResistencia;
  }
  if (filtros.ambiente.length > 0) {
    params.Ambiente = filtros.ambiente;
  }
  if (filtros.acabamento.length > 0) {
    params.Acabamento = filtros.acabamento;
  }

  return params;
}

export const estoqueService = {
  async obterOpcoesFiltro(): Promise<OpcoesFiltroEstoque> {
    const { data } = await api.get<OpcoesFiltroEstoque>(
      "/api/Estoque/obterOpcoesFiltro",
    );
    return data;
  },

  async consultarEstoque(filtros: FiltrosEstoque): Promise<ItemEstoque[]> {
    const { data } = await api.get<ItemEstoque[]>(
      "/api/Estoque/consultarEstoque",
      {
        params: buildQueryParams(filtros),
        paramsSerializer: {
          indexes: null,
        },
      },
    );
    return data;
  },
};
