import { StopRepository } from '../repositories/stop.repository';
import { IStop, IStopCreate, IStopResponse } from '../interfaces/stop.interface';
import { IStopDocument } from '../models/stop.model';
import { Route } from '../models/route.model';
import { Types } from 'mongoose';

export class StopService {
  private stopRepository: StopRepository;

  constructor() {
    this.stopRepository = new StopRepository();
  }

  private mapToResponse(stop: IStopDocument): IStopResponse {
    return {
      _id: stop._id.toString(),
      name: stop.name,
      type: stop.type,
      district: stop.district,
      createdAt: stop.createdAt!,
      updatedAt: stop.updatedAt!,
    };
  }

  async createStop(stopData: IStopCreate): Promise<IStopResponse> {
    const existingStop = await this.stopRepository.findByName(stopData.name);
    if (existingStop) {
      throw new Error('Stop with this name already exists');
    }

    const stop = await this.stopRepository.create(stopData);
    return this.mapToResponse(stop);
  }

  async getStopById(id: string): Promise<IStopResponse | null> {
    const stop = await this.stopRepository.findById(id);
    return stop ? this.mapToResponse(stop) : null;
  }

  async getAllStops(): Promise<IStopResponse[]> {
    const stops = await this.stopRepository.findAll();
    return stops.map(stop => this.mapToResponse(stop));
  }

  async updateStop(id: string, stopData: Partial<IStopCreate>): Promise<IStopResponse | null> {
    if (stopData.name) {
      const existingStop = await this.stopRepository.findByName(stopData.name);
      if (existingStop && existingStop._id.toString() !== id) {
        throw new Error('Stop with this name already exists');
      }
    }

    const updatedStop = await this.stopRepository.update(id, stopData);
    return updatedStop ? this.mapToResponse(updatedStop) : null;
  }

  async deleteStop(id: string): Promise<boolean> {
    // Check if any routes are using this stop
    const routesUsingStop = await Route.find({
      'stops.stopId': new Types.ObjectId(id)
    });

    if (routesUsingStop.length > 0) {
      throw new Error('Cannot delete stop as it is being used by one or more routes');
    }

    const result = await this.stopRepository.delete(id);
    return !!result;
  }
} 