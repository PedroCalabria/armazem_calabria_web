import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useSignUp } from "../hooks/useSignUp";
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
import { TiposPerfil } from "@/lib/enums/tiposPerfil.enum";

const signUpSchema = z
  .object({
    nome: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z
      .string()
      .min(1, "Email é obrigatório")
      .email("Formato de email inválido"),
    senha: z
      .string()
      .min(1, "Senha é obrigatória"),
    //   .min(8, "A senha deve ter pelo menos 8 caracteres")
    //   .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    //   .regex(/[0-9]/, "A senha deve conter pelo menos um número"),
    confirmeSenha: z.string().min(1, "Confirmação de senha é obrigatória"),
    idPerfil: z
      .number()
      .refine(
        (value) => Object.values(TiposPerfil).includes(value as TiposPerfil),
        {
          message: "Selecione um perfil válido",
        },
      ),
  })
  .refine((data) => data.senha === data.confirmeSenha, {
    message: "As senhas não coincidem",
    path: ["confirmeSenha"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const { mutate: signUp, isPending } = useSignUp();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      confirmeSenha: "",
      idPerfil: undefined,
    },
  });

  function onSubmit({ confirmeSenha: _confirm, ...values }: SignUpFormValues) {
    signUp(
      values as {
        nome: string;
        email: string;
        senha: string;
        idPerfil: TiposPerfil;
      },
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Criar conta</CardTitle>
        <CardDescription>
          Preencha os dados para se cadastrar no sistema
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="João Silva"
                      autoComplete="name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <FormMessage />
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
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmeSenha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*
              Select nativo usado aqui como componente controlado.
              O value vem do RHF (estado controlado) e onChange atualiza o RHF.
              Diferente de um select não controlado onde o valor ficaria apenas no DOM.
            */}
            <FormField
              control={form.control}
              name="idPerfil"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perfil</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={field.value ?? ""}
                      onBlur={field.onBlur}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    >
                      <option value="" disabled>
                        Selecione um perfil
                      </option>
                      <option value={TiposPerfil.Gestor}>Gestor</option>
                      <option value={TiposPerfil.LojistaInterno}>
                        Lojista Interno
                      </option>
                      <option value={TiposPerfil.LojistaExterno}>
                        Lojista Externo
                      </option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Cadastrando..." : "Criar conta"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className="underline underline-offset-4 hover:text-primary"
              >
                Entrar
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
