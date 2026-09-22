import { Module } from '@nestjs/common';
import { CognitoModule } from '@/infrastructure/cognito/cognito.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [CognitoModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
