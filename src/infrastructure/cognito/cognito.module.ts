import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  AUTH_SERVICE,
  COGNITO_SERVICE,
} from '@/common/constants/injection-tokens';
import { RepositoriesModule } from '@/infrastructure/repositories/repositories.module';
import { AuthServiceFactory } from './auth-service.factory';
import { CognitoAuthService } from './cognito-auth.service';
import { CognitoService } from './cognito.service';
import { MockAuthService } from './mock-auth.service';
import { MockCognitoService } from './mock-cognito.service';
import { CognitoServiceFactory } from './cognito-service.factory';

@Module({
  imports: [ConfigModule, RepositoriesModule],
  providers: [
    CognitoService,
    MockCognitoService,
    CognitoServiceFactory,
    CognitoAuthService,
    MockAuthService,
    AuthServiceFactory,
    {
      provide: COGNITO_SERVICE,
      useFactory: (factory: CognitoServiceFactory) => factory.create(),
      inject: [CognitoServiceFactory],
    },
    {
      provide: AUTH_SERVICE,
      useFactory: (factory: AuthServiceFactory) => factory.create(),
      inject: [AuthServiceFactory],
    },
  ],
  exports: [COGNITO_SERVICE, AUTH_SERVICE],
})
export class CognitoModule {}
