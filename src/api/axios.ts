import axios from "axios";
import { attachAuthInterceptors } from "./interceptors/auth.interceptor";

/**
 * Instância Axios compartilhada por toda a aplicação.
 *
 * withCredentials: true — necessário para que o browser envie automaticamente
 * o cookie HttpOnly do refresh token nas requisições ao mesmo origin.
 * Sem isso, o cookie seria ignorado e o refresh token nunca chegaria ao servidor.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Registra os interceptors de autenticação (token injection + refresh proativo/reativo)
attachAuthInterceptors(api);

export default api;
