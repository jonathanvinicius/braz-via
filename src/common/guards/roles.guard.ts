import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ROLES_KEY } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/domain/enums/UserRole';
import type { AuthUserPayload } from '@/common/types/auth-user.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: AuthUserPayload }>();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException();
    }

    const adminGroup = this.config.get<string>('cognito.adminGroup') ?? 'admin';
    const allowed =
      requiredRoles.includes(user.role) ||
      (requiredRoles.includes(UserRole.ADMIN) &&
        user.groups.includes(adminGroup));

    if (!allowed) {
      throw new ForbiddenException('Permissão insuficiente');
    }

    return true;
  }
}
