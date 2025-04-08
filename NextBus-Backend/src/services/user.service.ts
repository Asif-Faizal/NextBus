import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { IUser, IUserLogin, IUserResponse } from '../interfaces/user.interface';
import { IUserDocument } from '../models/user.model';

export class UserService {
  private userRepository: UserRepository;
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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
    return jwt.sign({ userId }, this.JWT_SECRET, { expiresIn: '24h' });
  }

  async createSuperAdmin(username: string, password: string): Promise<IUserResponse> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    const user = await this.userRepository.create({
      username,
      password: hashedPassword,
      role: 'superadmin',
    });

    const token = this.generateToken(user._id.toString());
    return {
      _id: user._id.toString(),
      username: user.username,
      role: user.role,
      token,
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
    return {
      _id: user._id.toString(),
      username: user.username,
      role: user.role,
      token,
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