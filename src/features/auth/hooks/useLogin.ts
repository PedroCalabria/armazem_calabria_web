import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "../services/authService";
import { useAuth } from "@/context/auth/useAuth";
import type { LoginRequest } from "../types/auth.types";

/**
 * useLogin — mutation hook para autenticação.
 *
 * Por que useMutation (TanStack Query) aqui?
 * - Gerencia automaticamente os estados isPending, isError, error
 * - Garante que o componente re-renderize nos momentos certos sem boilerplate
 * - A lógica de side-effects (setUser, redirect, toast) fica centralizada aqui,
 *   fora do componente de formulário (separação de responsabilidades)
 *
 * O interceptor Axios NÃO interfere aqui: o login é sempre uma requisição
 * sem token (o usuário ainda não está autenticado).
 */
export function useLogin() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => { 
      
      const response = authService.login(credentials);

      console.log("response:", response); // Log para depuração

      return response;

    },

    onSuccess: ({ token, usuario }) => {
      console.log("Login bem-sucedido. Token:", token, "User:", usuario); // Log para depuração
      setUser(token, usuario);
      toast.success(`Bem-vindo, ${usuario.nome}!`);
      navigate("/pisos", { replace: true });
    },

    onError: (error) => {
      const message = axios.isAxiosError(error) && error.response?.data?.error;
      console.log("Erro na autenticação:", error);
      toast.error(message || "Email ou senha inválidos.");
    },
  });
}
