import api from "@/api/axios";
import type { UsuarioPendente } from "../types/usuario.types";

export const usuarioService = {
  async consultarPendentes(): Promise<UsuarioPendente[]> {
    const { data } = await api.get<UsuarioPendente[]>(
      "/api/Usuario/consultarUsuariosPendentesAprovacao",
    );
    return data;
  },

  async autorizarPerfil(emailNovoUsuario: string): Promise<void> {
    await api.post("/api/Usuario/autorizarPerfilGestor", null, {
      params: { emailNovoUsuario },
    });
  },
};
