import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { IUserLogin, IRefreshTokenRequest } from '../interfaces/user.interface';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials: IUserLogin = req.body;
      const result = await this.userService.login(credentials);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error instanceof Error ? error.message : 'Authentication failed' });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken }: IRefreshTokenRequest = req.body;
      
      if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token is required' });
        return;
      }
      
      const result = await this.userService.refreshToken(refreshToken);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error instanceof Error ? error.message : 'Token refresh failed' });
    }
  }

  async initializeSuperAdmins(): Promise<void> {
    await this.userService.initializeSuperAdmins();
  }
} 