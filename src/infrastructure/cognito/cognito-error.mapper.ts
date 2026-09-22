import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';

interface CognitoSdkError {
  name?: string;
  message?: string;
}

const PASSWORD_POLICY_TRANSLATIONS: Array<[RegExp, string]> = [
  [/uppercase characters/i, 'letras maiúsculas (A-Z)'],
  [/lowercase characters/i, 'letras minúsculas (a-z)'],
  [/numeric characters/i, 'números'],
  [/symbol characters|special characters/i, 'caracteres especiais'],
  [/at least (\d+) characters/i, 'mínimo de $1 caracteres'],
];

function translatePasswordPolicyMessage(message?: string): string {
  if (!message) {
    return 'A senha não atende à política de segurança do Cognito.';
  }

  const requirements = PASSWORD_POLICY_TRANSLATIONS.flatMap(([pattern, label]) => {
    const match = message.match(pattern);
    if (!match) return [];
    return [label.replace('$1', match[1] ?? '8')];
  });

  if (requirements.length > 0) {
    return `A senha deve conter: ${requirements.join(', ')}.`;
  }

  const detail = message.split('policy:')[1]?.trim();
  if (detail) {
    return `A senha não atende à política de segurança: ${detail}`;
  }

  return 'A senha não atende à política de segurança do Cognito.';
}

export function mapCognitoError(error: unknown): never {
  if (error instanceof HttpException) {
    throw error;
  }

  const err = error as CognitoSdkError;
  const name = err.name ?? '';
  const message = err.message ?? '';

  switch (name) {
    case 'InvalidPasswordException':
      throw new BadRequestException(translatePasswordPolicyMessage(message));

    case 'UsernameExistsException':
      throw new ConflictException('Este e-mail já está cadastrado no Cognito.');

    case 'InvalidParameterException':
      throw new BadRequestException(
        message.includes('password')
          ? translatePasswordPolicyMessage(message)
          : 'Dados inválidos. Verifique e-mail, nome e senha.',
      );

    case 'UserNotFoundException':
      throw new UnauthorizedException('E-mail ou senha inválidos.');

    case 'NotAuthorizedException':
      throw new UnauthorizedException('E-mail ou senha inválidos.');

    case 'GroupNotFoundException':
      throw new InternalServerErrorException(
        'Grupo de permissão não encontrado no Cognito. Verifique COGNITO_ADMIN_GROUP.',
      );

    case 'ResourceNotFoundException':
      throw new InternalServerErrorException(
        'Recurso do Cognito não encontrado. Verifique pool, client e região.',
      );

    case 'LimitExceededException':
    case 'TooManyRequestsException':
      throw new ServiceUnavailableException(
        'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
      );

    default:
      throw new BadRequestException(
        'Não foi possível concluir a operação de autenticação. Tente novamente.',
      );
  }
}
