import { Navigate } from "react-router-dom";

export function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Acesso negado</h1>
      <p className="text-muted-foreground">
        Você não tem permissão para acessar esta página.
      </p>
      <a
        href="/pisos"
        className="underline underline-offset-4 hover:text-primary text-sm"
      >
        Voltar ao início
      </a>
    </main>
  );
}

export { Navigate };
