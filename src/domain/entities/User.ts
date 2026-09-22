import type { UserRole } from '../enums/UserRole';

export interface User {
  id: string;
  email: string;
  name: string;
  cognitoSub: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
