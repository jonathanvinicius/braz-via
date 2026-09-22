import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import type {
  AuthLoginResponse,
  AuthLoginResult,
  IAuthService,
} from '@/domain/services/IAuthService';
import { mapCognitoError } from './cognito-error.mapper';

@Injectable()
export class CognitoAuthService implements IAuthService {
  private readonly client: CognitoIdentityProviderClient;

  constructor(private readonly config: ConfigService) {
    this.client = new CognitoIdentityProviderClient({
      region: this.config.get<string>('cognito.region'),
    });
  }

  async login(params: {
    email: string;
    password: string;
  }): Promise<AuthLoginResponse> {
    const clientId = this.config.get<string>('cognito.clientId');
    if (!clientId) {
      throw new InternalServerErrorException('COGNITO_CLIENT_ID não configurado');
    }

    let result;

    try {
      result = await this.client.send(
        new InitiateAuthCommand({
          ClientId: clientId,
          AuthFlow: 'USER_PASSWORD_AUTH',
          AuthParameters: {
            USERNAME: params.email.toLowerCase(),
            PASSWORD: params.password,
          },
        }),
      );
    } catch (error: unknown) {
      mapCognitoError(error);
    }

    if (result.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
      if (!result.Session) {
        throw new InternalServerErrorException('Sessão Cognito ausente');
      }

      return {
        challenge: 'NEW_PASSWORD_REQUIRED',
        session: result.Session,
        email: params.email.toLowerCase(),
      };
    }

    return this.mapAuthResult(result.AuthenticationResult);
  }

  async completeNewPassword(params: {
    email: string;
    newPassword: string;
    session: string;
  }): Promise<AuthLoginResult> {
    const clientId = this.config.get<string>('cognito.clientId');
    if (!clientId) {
      throw new InternalServerErrorException('COGNITO_CLIENT_ID não configurado');
    }

    let result;

    try {
      result = await this.client.send(
        new RespondToAuthChallengeCommand({
          ClientId: clientId,
          ChallengeName: 'NEW_PASSWORD_REQUIRED',
          Session: params.session,
          ChallengeResponses: {
            USERNAME: params.email.toLowerCase(),
            NEW_PASSWORD: params.newPassword,
          },
        }),
      );
    } catch (error: unknown) {
      mapCognitoError(error);
    }

    if (!result.AuthenticationResult?.AccessToken) {
      throw new BadRequestException('Não foi possível definir a nova senha');
    }

    return this.mapAuthResult(result.AuthenticationResult);
  }

  private mapAuthResult(
    auth?: {
      AccessToken?: string;
      RefreshToken?: string;
      ExpiresIn?: number;
      TokenType?: string;
    },
  ): AuthLoginResult {
    if (!auth?.AccessToken) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    return {
      accessToken: auth.AccessToken,
      refreshToken: auth.RefreshToken,
      expiresIn: auth.ExpiresIn,
      tokenType: auth.TokenType,
    };
  }
}
