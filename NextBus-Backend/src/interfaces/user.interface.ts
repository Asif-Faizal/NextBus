export interface IUser {
  username: string;
  password: string;
  role: 'superadmin' | 'admin' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserLogin {
  username: string;
  password: string;
}

export interface IUserResponse {
  _id: string;
  username: string;
  role: string;
  token?: string;
} 