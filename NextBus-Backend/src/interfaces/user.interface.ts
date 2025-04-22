export interface IUser {
  username: string;
  password: string;
  role: 'superadmin' | 'admin' | 'user';
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserLogin {
  username: string;
  password: string;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export interface ITokenResponse {
  token: string;
  refreshToken: string;
}

export interface IUserResponse {
  _id: string;
  username: string;
  role: string;
  token?: string;
  refreshToken?: string;
} 