import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "../hooks/useLogin";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Schema de validação Zod para o formulário de login.
 *
 * COMPONENTE CONTROLADO:
 * Este formulário usa React Hook Form no modo controlado.
 * Cada campo é registrado via `useForm` e seu valor é gerenciado pelo hook.
 * A cada mudança de input, o React Hook Form atualiza o estado interno
 * e revalida o campo em tempo real (mode: 'onChange').
 *
 * Vantagem sobre estado manual com useState:
 * O RHF usa um único re-render por campo em vez de re-renderizar o formulário
 * inteiro a cada keystroke — mais performático em formulários grandes.
 */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Formato de email inválido"),
  senha: z
    .string()
    .min(1, "Senha é obrigatória")
    // .min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();

  /**
   * useForm — inicializa o formulário controlado.
   * - resolver: conecta o Zod ao RHF para validação automática
   * - mode: 'onChange' → valida cada campo enquanto o usuário digita
   * - defaultValues: necessário para formulários controlados (evita warning de uncontrolled→controlled)
   */
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  function onSubmit(values: LoginFormValues) {
    login(values);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Entrar</CardTitle>
        <CardDescription>
          Acesse o sistema de estoque Armazém Calabria
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/*
          Form do shadcn é um wrapper sobre o FormProvider do RHF.
          Garante que os campos filhos (FormField, etc.) tenham acesso
          ao contexto do formulário sem prop drilling.
        */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/*
              FormField usa o padrão render props do RHF.
              O `field` passado para o render contém: value, onChange, onBlur, ref.
              Esses são os atributos que tornam o Input um componente CONTROLADO —
              o valor exibido vem do estado do RHF, não do DOM.
            */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage /> {/* Exibe o erro do Zod em tempo real */}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
