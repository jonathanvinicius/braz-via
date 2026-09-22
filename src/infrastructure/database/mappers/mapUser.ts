import type { User } from '@/domain/entities/User';
import type { UserModel } from '../models/UserModel';

export function mapUser(model: UserModel): User {
  return {
    id: model.id,
    email: model.email,
    name: model.name,
    cognitoSub: model.cognitoSub,
    role: model.role,
    active: model.active,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
  };
}
