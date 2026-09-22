export interface AuthLoginResult {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
}

export interface AuthLoginChallengeResult {
  challenge: 'NEW_PASSWORD_REQUIRED';
  session: string;
  email: string;
}

export type AuthLoginResponse = AuthLoginResult | AuthLoginChallengeResult;

export interface IAuthService {
  login(params: {
    email: string;
    password: string;
  }): Promise<AuthLoginResponse>;

  completeNewPassword(params: {
    email: string;
    newPassword: string;
    session: string;
  }): Promise<AuthLoginResult>;
}
