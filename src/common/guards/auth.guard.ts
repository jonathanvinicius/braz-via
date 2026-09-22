import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';
import { USER_REPOSITORY } from '@/common/constants/injection-tokens';
import { Inject } from '@nestjs/common';
import type { IUserRepository } from '@/domain/repositories/IUserRepository';
import { UserRole } from '@/domain/enums/UserRole';
import type { AuthUserPayload } from '@/common/types/auth-user.type';
import { mapJwtAuthError } from '@/common/utils/jwt-auth-error.mapper';

@Injectable()
export class AuthGuard implements CanActivate {
  private verifier: ReturnType<typeof CognitoJwtVerifier.create> | null = null;

  constructor(
    private readonly reflector: Reflector,
    private readonly config: ConfigService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<Request & { user?: AuthUserPayload }>();
    if (request.method === 'OPTIONS') {
      return true;
    }
    const header = request.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      if (isPublic) return true;
      throw new UnauthorizedException('Token ausente');
    }

    const token = header.slice(7);

    try {
      await this.attachUserFromToken(request, token);
    } catch (error) {
      if (isPublic) {
        return true;
      }

      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
        throw error;
      }

      throw mapJwtAuthError(error);
    }

    return true;
  }

  private async attachUserFromToken(
    request: Request & { user?: AuthUserPayload },
    token: string,
  ): Promise<void> {
    let cognitoSub: string;
    let email: string;
    let groups: string[] = [];

    if (this.config.get<boolean>('cognito.mock')) {
      if (token !== 'mock-admin-token' && token !== 'mock-staff-token') {
        throw new UnauthorizedException(
          'Sessão inválida ou expirada. Faça login novamente.',
        );
      }
      cognitoSub =
        token === 'mock-admin-token' ? 'mock-admin-sub' : 'mock-staff-sub';
      email =
        token === 'mock-admin-token'
          ? 'admin@brazvia.local'
          : 'staff@brazvia.local';
      groups =
        token === 'mock-admin-token'
          ? [this.config.get<string>('cognito.adminGroup') ?? 'admin']
          : ['staff'];
    } else {
      const poolId = this.config.get<string>('cognito.userPoolId');
      const clientId = this.config.get<string>('cognito.clientId');
      if (!poolId || !clientId) {
        throw new UnauthorizedException('Cognito não configurado');
      }
      if (!this.verifier) {
        this.verifier = CognitoJwtVerifier.create({
          userPoolId: poolId,
          tokenUse: 'access',
          clientId,
        });
      }

      let payload;
      try {
        payload = await this.verifier.verify(token);
      } catch (error) {
        throw mapJwtAuthError(error);
      }

      cognitoSub = payload.sub;
      email = String(payload.email ?? payload.username ?? '');
      const rawGroups = payload['cognito:groups'];
      groups = Array.isArray(rawGroups)
        ? rawGroups.map(String)
        : typeof rawGroups === 'string'
          ? [rawGroups]
          : [];
    }

    let user = await this.userRepository.findByCognitoSub(cognitoSub);

    if (!user && this.config.get<boolean>('cognito.mock')) {
      const isAdmin = groups.includes(
        this.config.get<string>('cognito.adminGroup') ?? 'admin',
      );
      user = await this.userRepository.create({
        email,
        name: isAdmin ? 'Admin BRAZVIA' : 'Staff BRAZVIA',
        cognitoSub,
        role: isAdmin ? UserRole.ADMIN : UserRole.STAFF,
      });
    }

    if (!user?.active) {
      throw new ForbiddenException('Usuário não cadastrado ou inativo');
    }

    request.user = {
      id: user.id,
      email: user.email,
      cognitoSub: user.cognitoSub,
      role: user.role,
      groups,
    };
  }
}
