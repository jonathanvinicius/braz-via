import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '@/common/constants/injection-tokens';
import { UserRole } from '@/domain/enums/UserRole';
import type {
  AuthLoginResponse,
  AuthLoginResult,
  IAuthService,
} from '@/domain/services/IAuthService';
import type { IUserRepository } from '@/domain/repositories/IUserRepository';

const MOCK_ADMIN_TOKEN = 'mock-admin-token';
const MOCK_STAFF_TOKEN = 'mock-staff-token';

@Injectable()
export class MockAuthService implements IAuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async login(params: {
    email: string;
    password: string;
  }): Promise<AuthLoginResponse> {
    if (!params.password.trim()) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const user = await this.userRepository.findByEmail(params.email.toLowerCase());
    if (!user?.active) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    return {
      accessToken:
        user.role === UserRole.ADMIN ? MOCK_ADMIN_TOKEN : MOCK_STAFF_TOKEN,
      tokenType: 'Bearer',
      expiresIn: 3600,
    };
  }

  async completeNewPassword(): Promise<AuthLoginResult> {
    throw new UnauthorizedException('Desafio de senha não disponível em mock');
  }
}
