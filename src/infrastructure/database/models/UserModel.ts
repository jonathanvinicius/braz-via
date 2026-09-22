import { DataTypes, Model, type Optional } from 'sequelize';
import { sequelize } from '../sequelize';
import { UserRole } from '@/domain/enums/UserRole';

interface UserAttributes {
  id: string;
  email: string;
  name: string;
  cognitoSub: string;
  role: UserRole;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreation = Optional<UserAttributes, 'id' | 'active'>;

export class UserModel
  extends Model<UserAttributes, UserCreation>
  implements UserAttributes
{
  declare id: string;
  declare email: string;
  declare name: string;
  declare cognitoSub: string;
  declare role: UserRole;
  declare active: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(180),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    cognitoSub: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      field: 'cognito_sub',
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.STAFF,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  },
);
