import { Inject, Injectable } from '@nestjs/common';
import { AUTH_SERVICE } from '@/common/constants/injection-tokens';
import type { IAuthService } from '@/domain/services/IAuthService';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  login(email: string, password: string) {
    return this.authService.login({ email, password });
  }

  completeNewPassword(email: string, newPassword: string, session: string) {
    return this.authService.completeNewPassword({
      email,
      newPassword,
      session,
    });
  }
}
