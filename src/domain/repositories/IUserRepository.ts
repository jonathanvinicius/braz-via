import type { User } from '../entities/User';
import type { UserRole } from '../enums/UserRole';

export interface CreateUserInput {
  email: string;
  name: string;
  cognitoSub: string;
  role: UserRole;
}

export interface IUserRepository {
  create(input: CreateUserInput): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByCognitoSub(cognitoSub: string): Promise<User | null>;
}
