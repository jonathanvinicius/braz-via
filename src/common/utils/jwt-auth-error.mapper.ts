import { UnauthorizedException } from '@nestjs/common';

const JWT_ERROR_NAMES = new Set([
  'JwtInvalidSignatureError',
  'JwtExpiredError',
  'JwtInvalidClaimError',
  'JwtInvalidIssuerError',
  'JwtInvalidAudienceError',
  'JwtParseError',
  'JwtBaseError',
]);

export function mapJwtAuthError(error: unknown): UnauthorizedException {
  const name = (error as { name?: string })?.name ?? '';

  if (JWT_ERROR_NAMES.has(name) || name.startsWith('Jwt')) {
    return new UnauthorizedException(
      'Sessão inválida ou expirada. Faça login novamente.',
    );
  }

  return new UnauthorizedException('Não foi possível validar o token de acesso.');
}

export function isJwtVerifyError(error: unknown): boolean {
  const name = (error as { name?: string })?.name ?? '';
  return JWT_ERROR_NAMES.has(name) || name.startsWith('Jwt');
}
