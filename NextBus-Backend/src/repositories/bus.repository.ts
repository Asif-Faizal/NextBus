import { Bus, IBusDocument } from '../models/bus.model';
import { BusHistory, IBusHistoryDocument } from '../models/bus-history.model';
import { IBus, IBusHistory, BusStatus } from '../interfaces/bus.interface';
import mongoose from 'mongoose';
import { logDebug } from '../utils/logger';

export interface BusQueryOptions {
  page?: number;
  limit?: number;
  busName?: string;
  busNumberPlate?: string;
  status?: number;
  busType?: string;
  busSubType?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class BusRepository {
  async findAll(options?: BusQueryOptions): Promise<PaginatedResult<IBusDocument>> {
    logDebug('Finding buses with options: ' + JSON.stringify(options || {}));
    
    // Default values
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;
    
    // Build query
    let query = Bus.find();
    
    // Apply filters if provided
    if (options) {
      // Search by bus name (case-insensitive partial match)
      if (options.busName) {
        query = query.where('busName', { $regex: options.busName, $options: 'i' });
      }
      
      // Search by bus number plate (case-insensitive partial match)
      if (options.busNumberPlate) {
        query = query.where('busNumberPlate', { $regex: options.busNumberPlate, $options: 'i' });
      }
      
      // Filter by status
      if (options.status) {
        query = query.where('status', options.status);
      }
      
      // Filter by bus type
      if (options.busType) {
        query = query.where('busType', options.busType);
      }
      
      // Filter by bus sub type
      if (options.busSubType) {
        query = query.where('busSubType', options.busSubType);
      }
    }
    
    // Execute count query
    const total = await Bus.countDocuments(query.getQuery());
    
    // Execute main query with pagination
    const buses = await query
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    
    logDebug(`Found ${buses.length} buses (total: ${total})`);
    
    return {
      data: buses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findById(id: string): Promise<IBusDocument | null> {
    logDebug(`Finding bus by ID: ${id}`);
    const bus = await Bus.findById(id);
    if (bus) {
      logDebug(`Bus found: ${bus.busName}`);
    } else {
      logDebug(`Bus not found with ID: ${id}`);
    }
    return bus;
  }

  async create(busData: IBus): Promise<IBusDocument> {
    const bus = new Bus(busData);
    return bus.save();
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