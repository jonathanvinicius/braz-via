import { UserRole } from '@/domain/enums/UserRole';

export interface AuthUserPayload {
  id: string;
  email: string;
  cognitoSub: string;
  role: UserRole;
  groups: string[];
}
