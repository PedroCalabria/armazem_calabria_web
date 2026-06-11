import { useQuery } from "@tanstack/react-query";
import { usuarioService } from "../services/usuarioService";

export const USUARIOS_PENDENTES_KEY = ["usuarios", "pendentes"] as const;

export function useUsuariosPendentes() {
  return useQuery({
    queryKey: USUARIOS_PENDENTES_KEY,
    queryFn: usuarioService.consultarPendentes,
  });
}
