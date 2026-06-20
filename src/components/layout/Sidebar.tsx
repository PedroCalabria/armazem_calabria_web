import { NavLink } from "react-router-dom";
import { Users, Package, Layers, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth/useAuth";
import { authService } from "@/features/auth/services/authService";
import { TiposPerfil } from "@/lib/enums/tiposPerfil.enum";

export function Sidebar() {
  const { hasRole, logout } = useAuth();

  async function handleLogout() {
    try {
      await authService.logout();
    } finally {
      logout();
    }
  }

  const navItems = [
    { to: "/estoque", label: "Gerenciar Estoque", icon: Package },
    { to: "/pedidos", label: "Consultar/Cadastrar Pedidos", icon: Layers },
    ...(hasRole(TiposPerfil.Gestor)
      ? [{ to: "/aprovar-usuarios", label: "Aprovar Usuários", icon: Users }]
      : []),
  ];

  return (
    <aside className="w-64 shrink-0 min-h-screen border-r bg-background flex flex-col">
      <div className="p-5 border-b">
        <span className="font-semibold text-base tracking-tight">
          Armazém Calábria
        </span>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className="block">
            {({ isActive }) => (
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start gap-2", {
                  "font-semibold": isActive,
                })}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Button>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
