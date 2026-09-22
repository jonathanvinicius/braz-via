import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { IAuthService } from '@/domain/services/IAuthService';
import { CognitoAuthService } from './cognito-auth.service';
import { MockAuthService } from './mock-auth.service';

@Injectable()
export class AuthServiceFactory {
  constructor(
    private readonly config: ConfigService,
    private readonly cognitoAuthService: CognitoAuthService,
    private readonly mockAuthService: MockAuthService,
  ) {}

  create(): IAuthService {
    if (this.config.get<boolean>('cognito.mock')) {
      return this.mockAuthService;
    }

    return this.cognitoAuthService;
  }
}
