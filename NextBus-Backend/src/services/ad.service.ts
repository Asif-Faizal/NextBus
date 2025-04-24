import { AdRepository, AdQueryOptions, PaginatedResult } from '../repositories/ad.repository';
import { UserRepository } from '../repositories/user.repository';
import { IAd, IAdHistory, AdStatus } from '../interfaces/ad.interface';
import { IUserDocument } from '../models/user.model';
import { logDebug } from '../utils/logger';

export class AdService {
  private adRepository: AdRepository;
  private userRepository: UserRepository;

  constructor() {
    this.adRepository = new AdRepository();
    this.userRepository = new UserRepository();
  }

  async getAdById(adId: string): Promise<IAd> {
    logDebug(`Getting ad by ID: ${adId}`);
    const ad = await this.adRepository.findById(adId);
    
    if (!ad) {
      logDebug(`Ad not found with ID: ${adId}`);
      throw new Error('Ad not found');
    }
    
    logDebug(`Retrieved ad: ${ad.title}`);
    return ad.toObject();
  }

  async getAllAds(options?: AdQueryOptions): Promise<PaginatedResult<IAd>> {
    logDebug('Getting ads with options: ' + JSON.stringify(options || {}));
    const result = await this.adRepository.findAll(options);
    
    return {
      ...result,
      data: result.data.map(ad => ad.toObject())
    };
  }

  async createAd(adData: IAd, userId: string): Promise<IAd> {
    const user = await this.userRepository.findById(userId);
    if (!user || user.role !== 'superadmin') {
      throw new Error('Only superadmins can create ads');
    }

    const ad = await this.adRepository.create({
      ...adData,
      status: AdStatus.CREATED,
      createdBy: userId,
    });

    return ad.toObject();
  }

  async approveAd(adId: string, userId: string): Promise<IAd> {
    logDebug(`Attempting to approve ad ${adId} by user ${userId}`);
    
    const [ad, user] = await Promise.all([
      this.adRepository.findById(adId),
      this.userRepository.findById(userId),
    ]);

    if (!ad) {
      throw new Error('Ad not found');
    }

    if (!user || user.role !== 'superadmin') {
      throw new Error('Only superadmins can approve ads');
    }

    if (ad.status !== AdStatus.CREATED) {
      throw new Error('Ad is not in CREATED status');
    }

    const adCreatorId = ad.createdBy.toString().trim();
    const approvingUserId = userId.toString().trim();
    
    if (adCreatorId === approvingUserId) {
      throw new Error('You cannot approve an ad that you created. Only another superadmin can approve it.');
    }

    const updatedAd = await this.adRepository.update(adId, {
      status: AdStatus.APPROVED,
      approvedBy: userId,
    });

    if (!updatedAd) {
      throw new Error('Failed to update ad');
    }

    return updatedAd.toObject();
  }

  async requestEdit(adId: string, userId: string, newData: Partial<IAd>): Promise<IAd> {
    const ad = await this.adRepository.findById(adId);
    if (!ad) {
      throw new Error('Ad not found');
    }

    if (ad.status !== AdStatus.APPROVED) {
      throw new Error('Only approved ads can be edited');
    }

    await this.adRepository.createHistory({
      adId,
      previousData: ad.toObject(),
      newData,
      modifiedBy: userId,
      modificationType: 'EDIT',
      status: AdStatus.WAITING_FOR_EDIT,
      createdAt: new Date(),
    });

    const updatedAd = await this.adRepository.update(adId, {
      status: AdStatus.WAITING_FOR_EDIT,
      lastModifiedBy: userId,
    });

    return updatedAd!.toObject();
  }

  async requestDelete(adId: string, userId: string): Promise<IAd> {
    logDebug(`Attempting to request deletion of ad ${adId} by user ${userId}`);
    
    const [ad, user] = await Promise.all([
      this.adRepository.findById(adId),
      this.userRepository.findById(userId),
    ]);

    if (!ad) {
      logDebug(`Ad ${adId} not found for deletion request`);
      throw new Error('Ad not found');
    }

    if (!user || user.role !== 'superadmin') {
      logDebug(`User ${userId} is not authorized to request deletion`);
      throw new Error('Only superadmins can request deletion');
    }

    if (ad.status !== AdStatus.APPROVED) {
      logDebug(`Ad ${adId} is not in APPROVED status, current status: ${ad.status}`);
      throw new Error('Only approved ads can be deleted');
    }

    const adCreatorId = ad.createdBy.toString().trim();
    const requestingUserId = userId.toString().trim();
    
    if (adCreatorId === requestingUserId) {
      logDebug(`User ${userId} cannot request deletion of an ad they created`);
      throw new Error('You cannot request deletion of an ad that you created. Only another superadmin can request it.');
    }

    await this.adRepository.createHistory({
      adId,
      previousData: ad.toObject(),
      newData: {},
      modifiedBy: userId,
      modificationType: 'DELETE',
      status: AdStatus.WAITING_FOR_DELETE,
      createdAt: new Date(),
    });

    const updatedAd = await this.adRepository.update(adId, {
      status: AdStatus.WAITING_FOR_DELETE,
      lastModifiedBy: userId,
    });

    return updatedAd!.toObject();
  }

  async approveEdit(adId: string, userId: string): Promise<IAd> {
    const [ad, user, history] = await Promise.all([
      this.adRepository.findById(adId),
      this.userRepository.findById(userId),
      this.adRepository.findAdHistory(adId),
    ]);

    if (!ad) {
      throw new Error('Ad not found');
    }

    if (!user || user.role !== 'superadmin') {
      throw new Error('Only superadmins can approve edits');
    }

    if (ad.status !== AdStatus.WAITING_FOR_EDIT) {
      throw new Error('Ad is not waiting for edit approval');
    }

    const latestHistory = history[0];
    if (!latestHistory) {
      throw new Error('No edit history found');
    }

    const updatedAd = await this.adRepository.update(adId, {
      ...latestHistory.newData,
      status: AdStatus.APPROVED,
      lastModifiedBy: userId,
    });

    return updatedAd!.toObject();
  }

  async approveDelete(adId: string, userId: string): Promise<void> {
    logDebug(`Attempting to approve deletion of ad ${adId} by user ${userId}`);
    
    const [ad, user, history] = await Promise.all([
      this.adRepository.findById(adId),
      this.userRepository.findById(userId),
      this.adRepository.findAdHistory(adId),
    ]);

    if (!ad) {
      logDebug(`Ad ${adId} not found for deletion approval`);
      throw new Error('Ad not found');
    }

    if (!user || user.role !== 'superadmin') {
      logDebug(`User ${userId} is not authorized to approve deletion`);
      throw new Error('Only superadmins can approve deletions');
    }

    if (ad.status !== AdStatus.WAITING_FOR_DELETE) {
      logDebug(`Ad ${adId} is not in WAITING_FOR_DELETE status, current status: ${ad.status}`);
      throw new Error('Ad is not waiting for delete approval');
    }

    const latestHistory = history[0];
    if (!latestHistory) {
      logDebug(`No deletion history found for ad ${adId}`);
      throw new Error('No deletion history found');
    }

    const requestingUserId = latestHistory.modifiedBy.toString().trim();
    const approvingUserId = userId.toString().trim();
    
    if (requestingUserId === approvingUserId) {
      logDebug(`User ${userId} cannot approve their own deletion request`);
      throw new Error('You cannot approve a deletion request that you made. Only another superadmin can approve it.');
    }

    await this.adRepository.delete(adId);
  }

  async rejectModification(adId: string, userId: string): Promise<IAd> {
    const [ad, user] = await Promise.all([
      this.adRepository.findById(adId),
      this.userRepository.findById(userId),
    ]);

    if (!ad) {
      throw new Error('Ad not found');
    }

    if (!user || user.role !== 'superadmin') {
      throw new Error('Only superadmins can reject modifications');
    }

    if (![AdStatus.WAITING_FOR_EDIT, AdStatus.WAITING_FOR_DELETE].includes(ad.status)) {
      throw new Error('Ad is not waiting for modification approval');
    }

    const updatedAd = await this.adRepository.update(adId, {
      status: AdStatus.APPROVED,
      lastModifiedBy: userId,
    });

    return updatedAd!.toObject();
  }

  async getAdHistory(adId: string): Promise<IAdHistory[]> {
    const history = await this.adRepository.findAdHistory(adId);
    return history.map(h => h.toObject());
  }

  async getPendingModifications(): Promise<{ edits: IAd[]; deletes: IAd[] }> {
    const [edits, deletes] = await Promise.all([
      this.adRepository.findPendingEdits(),
      this.adRepository.findPendingDeletes(),
    ]);

    return {
      edits: edits.map(a => a.toObject()),
      deletes: deletes.map(a => a.toObject()),
    };
  }
} 