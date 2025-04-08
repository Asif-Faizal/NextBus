import { Bus, IBusDocument } from '../models/bus.model';
import { BusHistory, IBusHistoryDocument } from '../models/bus-history.model';
import { IBus, IBusHistory, BusStatus } from '../interfaces/bus.interface';
import mongoose from 'mongoose';
import { logDebug } from '../utils/logger';

export class BusRepository {
  async findAll(): Promise<IBusDocument[]> {
    logDebug('Finding all buses');
    const buses = await Bus.find().sort({ createdAt: -1 });
    logDebug(`Found ${buses.length} buses`);
    return buses;
  }

  async create(busData: IBus): Promise<IBusDocument> {
    const bus = new Bus(busData);
    return bus.save();
  }

  async findById(id: string): Promise<IBusDocument | null> {
    return Bus.findById(id);
  }

  async update(id: string, updateData: Partial<IBus>): Promise<IBusDocument | null> {
    logDebug(`Updating bus ${id} with data:`, updateData);
    
    const bus = await Bus.findById(id);
    if (!bus) {
      logDebug(`Bus ${id} not found`);
      return null;
    }

    // Check if createdBy is being modified
    if (updateData.createdBy && updateData.createdBy.toString() !== bus.createdBy.toString()) {
      logDebug(`WARNING: Attempt to modify createdBy field detected`);
      logDebug(`Original createdBy: ${bus.createdBy}, Attempted createdBy: ${updateData.createdBy}`);
      delete updateData.createdBy;
    }

    const updatedBus = await Bus.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (updatedBus) {
      logDebug(`Bus ${id} updated successfully`);
      logDebug(`Updated bus data:`, updatedBus.toObject());
    } else {
      logDebug(`Failed to update bus ${id}`);
    }

    return updatedBus;
  }

  async delete(id: string): Promise<IBusDocument | null> {
    return Bus.findByIdAndDelete(id);
  }

  async createHistory(historyData: IBusHistory): Promise<IBusHistoryDocument> {
    const history = new BusHistory(historyData);
    return history.save();
  }

  async findPendingEdits(): Promise<IBusDocument[]> {
    return Bus.find({ status: BusStatus.WAITING_FOR_EDIT });
  }

  async findPendingDeletes(): Promise<IBusDocument[]> {
    return Bus.find({ status: BusStatus.WAITING_FOR_DELETE });
  }

  async findBusHistory(busId: string): Promise<IBusHistoryDocument[]> {
    return BusHistory.find({ busId }).sort({ createdAt: -1 });
  }
} 