import { createContext } from "react";
import type { AuthState, AuthAction } from "@/features/auth/types/auth.types";
import { initialAuthState } from "@/features/auth/store/authReducer";

/**
 * Separamos o estado e o dispatch em dois contextos distintos.
 *
 * Por quê dois contextos?
 * Se usarmos um único contexto com { state, dispatch }, todo componente que
 * chama useContext re-renderizará sempre que o estado mudar — mesmo que o
 * componente só use as funções de dispatch (que nunca mudam).
 *
 * Com a separação:
 * - Componentes que só disparam ações (ex.: botão de logout) consomem
 *   apenas AuthDispatchContext → não re-renderizam quando o token muda.
 * - Componentes que lêem dados (ex.: PrivateRoute, avatar do usuário)
 *   consomem AuthStateContext → re-renderizam apenas quando estado muda.
 */

export const AuthStateContext = createContext<AuthState>(initialAuthState);

export const AuthDispatchContext = createContext<React.Dispatch<AuthAction>>(
  () => {
    throw new Error("AuthDispatchContext usado fora do AuthProvider");
  },
);
