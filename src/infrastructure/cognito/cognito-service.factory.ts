import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ICognitoService } from '@/domain/services/ICognitoService';
import { CognitoService } from './cognito.service';
import { MockCognitoService } from './mock-cognito.service';

@Injectable()
export class CognitoServiceFactory {
  constructor(
    private readonly config: ConfigService,
    private readonly cognitoService: CognitoService,
    private readonly mockCognitoService: MockCognitoService,
  ) {}

  create(): ICognitoService {
    if (this.config.get<boolean>('cognito.mock')) {
      return this.mockCognitoService;
    }

    return this.cognitoService;
  }
}
