/**
 * Utilitário para decodificar o payload de um JWT no cliente.
 *
 * IMPORTANTE: Esta função NÃO valida a assinatura do token.
 * A validação criptográfica é responsabilidade exclusiva do servidor.
 * Aqui apenas lemos o campo `exp` para decidir se o token está prestes a expirar,
 * evitando enviar requisições com tokens já inválidos.
 */

interface JwtPayload {
  sub?: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

/**
 * Decodifica o payload de um JWT (sem verificar assinatura).
 * Retorna null se o token for inválido ou malformado.
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // O payload é a segunda parte, codificada em Base64Url
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Retorna true se o token estiver expirado ou prestes a expirar
 * dentro da janela informada (padrão: 30 segundos).
 * Usado pelo interceptor para decidir se deve fazer refresh proativo.
 */
export function isTokenExpiringSoon(
  token: string,
  bufferSeconds = 30,
): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;

  const expiresAt = payload.exp * 1000; // converter de segundos para ms
  const now = Date.now();
  return now >= expiresAt - bufferSeconds * 1000;
}
