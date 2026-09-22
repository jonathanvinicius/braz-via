import type { UserRole } from '../enums/UserRole';

export interface CognitoCreateUserResult {
  cognitoSub: string;
  username: string;
  temporaryPassword?: string;
  alreadyExists: boolean;
}

export interface ICognitoService {
  createUser(params: {
    email: string;
    name: string;
    role: UserRole;
    password?: string;
  }): Promise<CognitoCreateUserResult>;
}
