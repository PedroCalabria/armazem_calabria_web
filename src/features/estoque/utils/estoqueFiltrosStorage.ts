import type { FiltrosEstoque } from "@/features/estoque/types/estoque.types";

const STORAGE_KEY = "estoque-filtros";

export function emptyFiltros(): FiltrosEstoque {
  return {
    tipoPiso: [],
    marca: [],
    nivelResistencia: [],
    ambiente: [],
    acabamento: [],
  };
}

function isValidFiltros(value: unknown): value is FiltrosEstoque {
  if (!value || typeof value !== "object") {
    return false;
  }

  const filtros = value as Record<string, unknown>;

  return (
    Array.isArray(filtros.tipoPiso) &&
    Array.isArray(filtros.marca) &&
    Array.isArray(filtros.nivelResistencia) &&
    Array.isArray(filtros.ambiente) &&
    Array.isArray(filtros.acabamento) &&
    filtros.tipoPiso.every((item) => typeof item === "number") &&
    filtros.marca.every((item) => typeof item === "number") &&
    filtros.nivelResistencia.every((item) => typeof item === "number") &&
    filtros.ambiente.every((item) => typeof item === "number") &&
    filtros.acabamento.every((item) => typeof item === "number")
  );
}

export function loadFiltros(): FiltrosEstoque | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    return isValidFiltros(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveFiltros(filtros: FiltrosEstoque): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtros));
}

export function clearFiltros(): void {
  localStorage.removeItem(STORAGE_KEY);
}
