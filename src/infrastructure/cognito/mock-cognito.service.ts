import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from '@/domain/enums/UserRole';
import type {
  CognitoCreateUserResult,
  ICognitoService,
} from '@/domain/services/ICognitoService';

@Injectable()
export class MockCognitoService implements ICognitoService {
  async createUser(params: {
    email: string;
    name: string;
    role: UserRole;
    password?: string;
  }): Promise<CognitoCreateUserResult> {
    return {
      cognitoSub: `mock-${uuidv4()}`,
      username: params.email,
      temporaryPassword: params.password ? undefined : 'Mock@123456',
      alreadyExists: false,
    };
  }
}
