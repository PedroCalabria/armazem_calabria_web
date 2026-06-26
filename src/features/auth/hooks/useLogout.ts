import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth/useAuth";
import { authService } from "../services/authService";

export function useLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return async function handleLogout() {
    try {
      await authService.logout();
    } catch {
      // Mesmo se a API falhar, limpa estado local
    } finally {
      logout();
      navigate("/login", { replace: true });
    }
  };
}
