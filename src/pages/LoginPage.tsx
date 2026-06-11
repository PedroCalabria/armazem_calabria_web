import { LoginForm } from "@/features/auth/components/LoginForm";
import { Link } from "react-router-dom";

export function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <LoginForm />
        <p className="text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link
            to="/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}
