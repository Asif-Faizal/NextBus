import { User, IUserDocument } from '../models/user.model';
import { IUser } from '../interfaces/user.interface';

export class UserRepository {
  async findByUsername(username: string): Promise<IUserDocument | null> {
    return User.findOne({ username });
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return User.findById(id);
  }

  async create(userData: IUser): Promise<IUserDocument> {
    const user = new User(userData);
    return user.save();
  }

  async findSuperAdmins(): Promise<IUserDocument[]> {
    return User.find({ role: 'superadmin' });
  }
} 