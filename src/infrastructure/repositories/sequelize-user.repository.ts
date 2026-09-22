import { Injectable } from '@nestjs/common';
import type { User } from '@/domain/entities/User';
import type {
  CreateUserInput,
  IUserRepository,
} from '@/domain/repositories/IUserRepository';
import { UserModel } from '@/infrastructure/database/models/UserModel';
import { mapUser } from '@/infrastructure/database/mappers/mapUser';

@Injectable()
export class SequelizeUserRepository implements IUserRepository {
  async create(input: CreateUserInput): Promise<User> {
    const row = await UserModel.create(input);
    return mapUser(row);
  }

  async findById(id: string): Promise<User | null> {
    const row = await UserModel.findByPk(id);
    return row ? mapUser(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await UserModel.findOne({ where: { email } });
    return row ? mapUser(row) : null;
  }

  async findByCognitoSub(cognitoSub: string): Promise<User | null> {
    const row = await UserModel.findOne({ where: { cognitoSub } });
    return row ? mapUser(row) : null;
  }
}
