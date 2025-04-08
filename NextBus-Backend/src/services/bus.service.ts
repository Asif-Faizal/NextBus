import { BusRepository } from '../repositories/bus.repository';
import { UserRepository } from '../repositories/user.repository';
import { IBus, IBusHistory, BusStatus } from '../interfaces/bus.interface';
import { IUserDocument } from '../models/user.model';
import { logDebug } from '../utils/logger';

export class BusService {
  private busRepository: BusRepository;
  private userRepository: UserRepository;

  constructor() {
    this.busRepository = new BusRepository();
    this.userRepository = new UserRepository();
  }

  async createBus(busData: IBus, userId: string): Promise<IBus> {
    const user = await this.userRepository.findById(userId);
    if (!user || user.role !== 'superadmin') {
      throw new Error('Only superadmins can create buses');
    }

    const bus = await this.busRepository.create({
      ...busData,
      status: BusStatus.CREATED,
      createdBy: userId,
    });

    return bus.toObject();
  }

  async approveBus(busId: string, userId: string): Promise<IBus> {
    logDebug(`Attempting to approve bus ${busId} by user ${userId}`);
    
    const [bus, user] = await Promise.all([
      this.busRepository.findById(busId),
      this.userRepository.findById(userId),
    ]);

    if (!bus) {
      throw new Error('Bus not found');
    }

    if (!user || user.role !== 'superadmin') {
      throw new Error('Only superadmins can approve buses');
    }

    if (bus.status !== BusStatus.CREATED) {
      throw new Error('Bus is not in CREATED status');
    }

    // Ensure the user is not the creator of the bus
    logDebug(`Bus createdBy: ${bus.createdBy}, User ID: ${userId}`);
    logDebug(`Bus createdBy type: ${typeof bus.createdBy}, User ID type: ${typeof userId}`);
    logDebug(`Bus createdBy value: "${bus.createdBy}", User ID value: "${userId}"`);
    logDebug(`Are they equal? ${bus.createdBy === userId}`);
    logDebug(`Are they equal with toString? ${bus.createdBy.toString() === userId.toString()}`);
    logDebug(`Are they equal with strict equality? ${bus.createdBy === userId}`);
    
    // Convert both to strings and trim any whitespace
    const busCreatorId = bus.createdBy.toString().trim();
    const approvingUserId = userId.toString().trim();
    
    logDebug(`After conversion - Bus creator: "${busCreatorId}", Approving user: "${approvingUserId}"`);
    logDebug(`Are they equal after conversion? ${busCreatorId === approvingUserId}`);
    
    if (busCreatorId === approvingUserId) {
      throw new Error('You cannot approve a bus that you created. Only another superadmin can approve it.');
    }

    // Double-check that the createdBy field is not being modified
    const updatedBus = await this.busRepository.update(busId, {
      status: BusStatus.APPROVED,
      approvedBy: userId,
    });

    if (!updatedBus) {
      throw new Error('Failed to update bus');
    }

    return updatedBus.toObject();
  }

  async requestEdit(busId: string, userId: string, newData: Partial<IBus>): Promise<IBus> {
    const bus = await this.busRepository.findById(busId);
    if (!bus) {
      throw new Error('Bus not found');
    }

    if (bus.status !== BusStatus.APPROVED) {
      throw new Error('Only approved buses can be edited');
    }

    // Create history record
    await this.busRepository.createHistory({
      busId,
      previousData: bus.toObject(),
      newData,
      modifiedBy: userId,
      modificationType: 'EDIT',
      status: BusStatus.WAITING_FOR_EDIT,
      createdAt: new Date(),
    });

    // Update bus status
    const updatedBus = await this.busRepository.update(busId, {
      status: BusStatus.WAITING_FOR_EDIT,
      lastModifiedBy: userId,
    });

    return updatedBus!.toObject();
  }

  async requestDelete(busId: string, userId: string): Promise<IBus> {
    const bus = await this.busRepository.findById(busId);
    if (!bus) {
      throw new Error('Bus not found');
    }

    if (bus.status !== BusStatus.APPROVED) {
      throw new Error('Only approved buses can be deleted');
    }

    // Create history record
    await this.busRepository.createHistory({
      busId,
      previousData: bus.toObject(),
      newData: {},
      modifiedBy: userId,
      modificationType: 'DELETE',
      status: BusStatus.WAITING_FOR_DELETE,
      createdAt: new Date(),
    });

    // Update bus status
    const updatedBus = await this.busRepository.update(busId, {
      status: BusStatus.WAITING_FOR_DELETE,
      lastModifiedBy: userId,
    });

    return updatedBus!.toObject();
  }

  async approveEdit(busId: string, userId: string): Promise<IBus> {
    const [bus, user, history] = await Promise.all([
      this.busRepository.findById(busId),
      this.userRepository.findById(userId),
      this.busRepository.findBusHistory(busId),
    ]);

    if (!bus) {
      throw new Error('Bus not found');
    }

    if (!user || user.role !== 'superadmin') {
      throw new Error('Only superadmins can approve edits');
    }

    if (bus.status !== BusStatus.WAITING_FOR_EDIT) {
      throw new Error('Bus is not waiting for edit approval');
    }

    const latestHistory = history[0];
    if (!latestHistory) {
      throw new Error('No edit history found');
    }

    // Apply the changes
    const updatedBus = await this.busRepository.update(busId, {
      ...latestHistory.newData,
      status: BusStatus.APPROVED,
      lastModifiedBy: userId,
    });

    return updatedBus!.toObject();
  }

  async approveDelete(busId: string, userId: string): Promise<void> {
    const [bus, user] = await Promise.all([
      this.busRepository.findById(busId),
      this.userRepository.findById(userId),
    ]);

    if (!bus) {
      throw new Error('Bus not found');
    }

    if (!user || user.role !== 'superadmin') {
      throw new Error('Only superadmins can approve deletions');
    }

    if (bus.status !== BusStatus.WAITING_FOR_DELETE) {
      throw new Error('Bus is not waiting for delete approval');
    }

    await this.busRepository.delete(busId);
  }

  async rejectModification(busId: string, userId: string): Promise<IBus> {
    const [bus, user] = await Promise.all([
      this.busRepository.findById(busId),
      this.userRepository.findById(userId),
    ]);

    if (!bus) {
      throw new Error('Bus not found');
    }

    if (!user || user.role !== 'superadmin') {
      throw new Error('Only superadmins can reject modifications');
    }

    if (![BusStatus.WAITING_FOR_EDIT, BusStatus.WAITING_FOR_DELETE].includes(bus.status)) {
      throw new Error('Bus is not waiting for modification approval');
    }

    const updatedBus = await this.busRepository.update(busId, {
      status: BusStatus.APPROVED,
      lastModifiedBy: userId,
    });

    return updatedBus!.toObject();
  }

  async getBusHistory(busId: string): Promise<IBusHistory[]> {
    const history = await this.busRepository.findBusHistory(busId);
    return history.map(h => h.toObject());
  }

  async getPendingModifications(): Promise<{ edits: IBus[]; deletes: IBus[] }> {
    const [edits, deletes] = await Promise.all([
      this.busRepository.findPendingEdits(),
      this.busRepository.findPendingDeletes(),
    ]);

    return {
      edits: edits.map(b => b.toObject()),
      deletes: deletes.map(b => b.toObject()),
    };
  }
}