import { Ad, IAdDocument } from '../models/ad.model';
import { AdHistory, IAdHistoryDocument } from '../models/ad-history.model';
import { IAd, IAdHistory, AdStatus } from '../interfaces/ad.interface';
import mongoose from 'mongoose';
import { logDebug } from '../utils/logger';

export interface AdQueryOptions {
  page?: number;
  limit?: number;
  title?: string;
  adClientName?: string;
  status?: number;
  location?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class AdRepository {
  async findAll(options?: AdQueryOptions): Promise<PaginatedResult<IAdDocument>> {
    logDebug('Finding ads with options: ' + JSON.stringify(options || {}));
    
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;
    
    let query = Ad.find();
    
    if (options) {
      if (options.title) {
        query = query.where('title', { $regex: options.title, $options: 'i' });
      }
      
      if (options.adClientName) {
        query = query.where('adClientName', { $regex: options.adClientName, $options: 'i' });
      }
      
      if (options.status) {
        query = query.where('status', options.status);
      }
      
      if (options.location) {
        query = query.where('location', { $regex: options.location, $options: 'i' });
      }
    }
    
    const total = await Ad.countDocuments(query.getQuery());
    
    const ads = await query
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    
    logDebug(`Found ${ads.length} ads (total: ${total})`);
    
    return {
      data: ads,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findById(id: string): Promise<IAdDocument | null> {
    logDebug(`Finding ad by ID: ${id}`);
    const ad = await Ad.findById(id);
    if (ad) {
      logDebug(`Ad found: ${ad.title}`);
    } else {
      logDebug(`Ad not found with ID: ${id}`);
    }
    return ad;
  }

  async create(adData: IAd): Promise<IAdDocument> {
    const ad = new Ad(adData);
    return ad.save();
  }

  async update(id: string, updateData: Partial<IAd>): Promise<IAdDocument | null> {
    logDebug(`Updating ad ${id} with data:`, updateData);
    
    const ad = await Ad.findById(id);
    if (!ad) {
      logDebug(`Ad ${id} not found`);
      return null;
    }

    if (updateData.createdBy && updateData.createdBy.toString() !== ad.createdBy.toString()) {
      logDebug(`WARNING: Attempt to modify createdBy field detected`);
      logDebug(`Original createdBy: ${ad.createdBy}, Attempted createdBy: ${updateData.createdBy}`);
      delete updateData.createdBy;
    }

    const updatedAd = await Ad.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (updatedAd) {
      logDebug(`Ad ${id} updated successfully`);
      logDebug(`Updated ad data:`, updatedAd.toObject());
    } else {
      logDebug(`Failed to update ad ${id}`);
    }

    return updatedAd;
  }

  async delete(id: string): Promise<IAdDocument | null> {
    return Ad.findByIdAndDelete(id);
  }

  async createHistory(historyData: IAdHistory): Promise<IAdHistoryDocument> {
    const history = new AdHistory(historyData);
    return history.save();
  }

  async findPendingEdits(): Promise<IAdDocument[]> {
    return Ad.find({ status: AdStatus.WAITING_FOR_EDIT });
  }

  async findPendingDeletes(): Promise<IAdDocument[]> {
    return Ad.find({ status: AdStatus.WAITING_FOR_DELETE });
  }

  async findAdHistory(adId: string): Promise<IAdHistoryDocument[]> {
    return AdHistory.find({ adId }).sort({ createdAt: -1 });
  }
} 