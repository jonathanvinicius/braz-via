import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AdminAddUserToGroupCommand,
  AdminCreateUserCommand,
  AdminGetUserCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { UserRole } from '@/domain/enums/UserRole';
import type {
  CognitoCreateUserResult,
  ICognitoService,
} from '@/domain/services/ICognitoService';
import { mapCognitoError } from './cognito-error.mapper';

function generatePassword(): string {
  const chars =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@_';
  let pwd = '';
  for (let i = 0; i < 12; i++) {
    pwd += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${pwd}A1!`;
}

@Injectable()
export class CognitoService implements ICognitoService {
  private readonly client: CognitoIdentityProviderClient;

  constructor(private readonly config: ConfigService) {
    this.client = new CognitoIdentityProviderClient({
      region: this.config.get<string>('cognito.region'),
    });
  }

  async createUser(params: {
    email: string;
    name: string;
    role: UserRole;
    password?: string;
  }): Promise<CognitoCreateUserResult> {
    const userPoolId = this.config.get<string>('cognito.userPoolId');
    if (!userPoolId) {
      throw new InternalServerErrorException('COGNITO_USER_POOL_ID não configurado');
    }

    const username = params.email.toLowerCase();
    const password = params.password ?? generatePassword();
    const adminGroup = this.config.get<string>('cognito.adminGroup') ?? 'admin';
    const group = params.role === UserRole.ADMIN ? adminGroup : 'staff';

    try {
      await this.client.send(
        new AdminCreateUserCommand({
          UserPoolId: userPoolId,
          Username: username,
          MessageAction: 'SUPPRESS',
          UserAttributes: [
            { Name: 'email', Value: username },
            { Name: 'email_verified', Value: 'true' },
            { Name: 'name', Value: params.name },
          ],
        }),
      );

      const cognitoSub = await this.resolveCognitoSub(userPoolId, username);

      await this.client.send(
        new AdminAddUserToGroupCommand({
          UserPoolId: userPoolId,
          Username: username,
          GroupName: group,
        }),
      );

      await this.setPermanentPassword(userPoolId, username, password);

      return {
        cognitoSub,
        username,
        alreadyExists: false,
      };
    } catch (error: unknown) {
      const err = error as { name?: string };
      if (err.name === 'UsernameExistsException') {
        throw new ConflictException('Este e-mail já está cadastrado no Cognito.');
      }
      mapCognitoError(error);
    }
  }

  private async resolveCognitoSub(
    userPoolId: string,
    username: string,
  ): Promise<string> {
    const user = await this.client.send(
      new AdminGetUserCommand({
        UserPoolId: userPoolId,
        Username: username,
      }),
    );

    const sub = user.UserAttributes?.find((attr) => attr.Name === 'sub')?.Value;

    if (!sub) {
      throw new InternalServerErrorException(
        'Não foi possível obter o sub do usuário no Cognito.',
      );
    }

    return sub;
  }

  private async setPermanentPassword(
    userPoolId: string,
    username: string,
    password: string,
  ): Promise<void> {
    await this.client.send(
      new AdminSetUserPasswordCommand({
        UserPoolId: userPoolId,
        Username: username,
        Password: password,
        Permanent: true,
      }),
    );
  }
}
