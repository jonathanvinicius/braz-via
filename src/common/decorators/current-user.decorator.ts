import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthUserPayload } from '@/common/types/auth-user.type';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUserPayload | undefined => {
    const request = context
      .switchToHttp()
      .getRequest<{ user?: AuthUserPayload }>();
    return request.user;
  },
);
