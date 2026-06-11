import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "../services/authService";
import type { SignUpRequest } from "../types/auth.types";
import { TiposPerfil } from "@/lib/enums/tiposPerfil.enum";

/**
 * useSignUp — mutation hook para cadastro de novo usuário.
 *
 * Após o cadastro bem-sucedido, redireciona para o login com uma mensagem
 * informativa. Se o perfil for Gestor, o backend manterá o cadastro
 * pendente de aprovação — o toast informa o usuário sobre isso.
 */
export function useSignUp() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: SignUpRequest) => {
      console.log("Dados enviados para cadastro:", data); // Log para depuração

      return authService.signUp(data);
    },

    onSuccess: (_data, variables) => {
      const isGestor = variables.idPerfil === TiposPerfil.Gestor;
      if (isGestor) {
        toast.info(
          "Cadastro realizado! Como Gestor, seu acesso precisa ser aprovado por outro Gestor.",
        );
      } else {
        toast.success(
          "Cadastro realizado com sucesso! Faça login para continuar.",
        );
      }
      navigate("/login", { replace: true });
    },

    onError: (error) => {
      console.error("Erro no cadastro:", error);
      toast.error(
        "Erro ao realizar cadastro. Verifique os dados e tente novamente.",
      );
    },
  });
}
