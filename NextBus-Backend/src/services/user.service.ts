import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserRepository } from '../repositories/user.repository';
import { IUser, IUserLogin, IUserResponse, ITokenResponse } from '../interfaces/user.interface';
import { IUserDocument } from '../models/user.model';

export class UserService {
  private userRepository: UserRepository;
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private readonly REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret-key';

  constructor() {
    this.userRepository = new UserRepository();
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, this.JWT_SECRET, { expiresIn: '1h' });
  }

  private generateRefreshToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }

  async createSuperAdmin(username: string, password: string): Promise<IUserResponse> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    const refreshToken = this.generateRefreshToken();

    const user = await this.userRepository.create({
      username,
      password: hashedPassword,
      role: 'superadmin',
      refreshToken,
    });

    const token = this.generateToken(user._id.toString());
    return {
      _id: user._id.toString(),
      username: user.username,
      role: user.role,
      token,
      refreshToken,
    };
  }

  async login(credentials: IUserLogin): Promise<IUserResponse> {
    const user = await this.userRepository.findByUsername(credentials.username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await this.comparePasswords(credentials.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user._id.toString());
    const refreshToken = this.generateRefreshToken();

    // Save refresh token to database
    await this.userRepository.updateRefreshToken(user._id.toString(), refreshToken);

    return {
      _id: user._id.toString(),
      username: user.username,
      role: user.role,
      token,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<ITokenResponse> {
    // Find user with this refresh token
    const user = await this.userRepository.findByRefreshToken(refreshToken);
    if (!user) {
      throw new Error('Invalid refresh token');
    }

    // Generate new tokens
    const newToken = this.generateToken(user._id.toString());
    const newRefreshToken = this.generateRefreshToken();

    // Update refresh token in database
    await this.userRepository.updateRefreshToken(user._id.toString(), newRefreshToken);

    return {
      token: newToken,
      refreshToken: newRefreshToken,
    };
  }

  async initializeSuperAdmins(): Promise<void> {
    const superAdmins = await this.userRepository.findSuperAdmins();
    if (superAdmins.length === 0) {
      // Create two super admins if none exist
      await this.createSuperAdmin('admin1', 'admin123');
      await this.createSuperAdmin('admin2', 'admin123');
    }
  }
} 