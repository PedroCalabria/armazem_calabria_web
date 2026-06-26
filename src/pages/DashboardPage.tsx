import { useAuth } from "@/context/auth/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { Button } from "@/components/ui/button";

/**
 * Placeholder do Dashboard — será expandido nas fases 2-6.
 * Por ora, demonstra o acesso ao estado de auth e o fluxo de logout.
 */
export function DashboardPage() {
  const { user } = useAuth();
  const handleLogout = useLogout();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {user && (
        <p className="text-muted-foreground">
          Olá, <span className="font-medium text-foreground">{user.name}</span>{" "}
          — Perfil:{" "}
          <span className="font-medium text-foreground">{user.role}</span>
        </p>
      )}
      <Button variant="outline" onClick={handleLogout}>
        Sair
      </Button>
    </main>
  );
}
