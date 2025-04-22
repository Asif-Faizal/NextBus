import { Stop, IStopDocument } from '../models/stop.model';
import { IStop } from '../interfaces/stop.interface';

export class StopRepository {
  async create(stopData: IStop): Promise<IStopDocument> {
    const stop = new Stop(stopData);
    return stop.save();
  }

  async findById(id: string): Promise<IStopDocument | null> {
    return Stop.findById(id);
  }

  async findByName(name: string): Promise<IStopDocument | null> {
    return Stop.findOne({ name });
  }

  async findAll(): Promise<IStopDocument[]> {
    return Stop.find();
  }

  async update(id: string, stopData: Partial<IStop>): Promise<IStopDocument | null> {
    return Stop.findByIdAndUpdate(id, stopData, { new: true });
  }

  async delete(id: string): Promise<IStopDocument | null> {
    return Stop.findByIdAndDelete(id);
  }
} 