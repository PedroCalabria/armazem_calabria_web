export const TiposPerfil = {
  Gestor: 1,
  LojistaInterno: 2,
  LojistaExterno: 3,
} as const;

export type TiposPerfil = (typeof TiposPerfil)[keyof typeof TiposPerfil];
