import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usuarioService } from "../services/usuarioService";
import { USUARIOS_PENDENTES_KEY } from "./useUsuariosPendentes";

export function useAutorizarUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => usuarioService.autorizarPerfil(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USUARIOS_PENDENTES_KEY });
      toast.success("Usuário autorizado com sucesso.");
    },
    onError: () => {
      toast.error("Não foi possível autorizar o usuário. Tente novamente.");
    },
  });
}
