import { Request, Response } from 'express';
import { BusService } from '../services/bus.service';
import { IBus } from '../interfaces/bus.interface';
import { logDebug } from '../utils/logger';

export class BusController {
  private busService: BusService;

  constructor() {
    this.busService = new BusService();
  }

  async getAllBuses(req: Request, res: Response): Promise<void> {
    try {
      logDebug('GET /api/buses - Getting all buses');
      const buses = await this.busService.getAllBuses();
      logDebug(`Returning ${buses.length} buses`);
      res.json(buses);
    } catch (error) {
      logDebug(`Error getting all buses: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to get buses' });
    }
  }

  async createBus(req: Request, res: Response): Promise<void> {
    try {
      const busData: IBus = req.body;
      const userId = req.userId!;
      const bus = await this.busService.createBus(busData, userId);
      res.status(201).json(bus);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to create bus' });
    }
  }

  async approveBus(req: Request, res: Response): Promise<void> {
    try {
      const { busId } = req.params;
      const userId = req.userId!;
      const bus = await this.busService.approveBus(busId, userId);
      res.json(bus);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to approve bus' });
    }
  }

  async requestEdit(req: Request, res: Response): Promise<void> {
    try {
      const { busId } = req.params;
      const userId = req.userId!;
      const newData: Partial<IBus> = req.body;
      const bus = await this.busService.requestEdit(busId, userId, newData);
      res.json(bus);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to request edit' });
    }
  }

  async requestDelete(req: Request, res: Response): Promise<void> {
    try {
      const { busId } = req.params;
      const userId = req.userId!;
      const bus = await this.busService.requestDelete(busId, userId);
      res.json(bus);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to request delete' });
    }
  }

  async approveEdit(req: Request, res: Response): Promise<void> {
    try {
      const { busId } = req.params;
      const userId = req.userId!;
      const bus = await this.busService.approveEdit(busId, userId);
      res.json(bus);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to approve edit' });
    }
  }

  async approveDelete(req: Request, res: Response): Promise<void> {
    try {
      const { busId } = req.params;
      const userId = req.userId!;
      await this.busService.approveDelete(busId, userId);
      res.json({ message: 'Bus deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to approve delete' });
    }
  }

  async rejectModification(req: Request, res: Response): Promise<void> {
    try {
      const { busId } = req.params;
      const userId = req.userId!;
      const bus = await this.busService.rejectModification(busId, userId);
      res.json(bus);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to reject modification' });
    }
  }

  async getBusHistory(req: Request, res: Response): Promise<void> {
    try {
      const { busId } = req.params;
      const history = await this.busService.getBusHistory(busId);
      res.json(history);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to get bus history' });
    }
  }

  async getPendingModifications(req: Request, res: Response): Promise<void> {
    try {
      const modifications = await this.busService.getPendingModifications();
      res.json(modifications);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to get pending modifications' });
    }
  }
} 