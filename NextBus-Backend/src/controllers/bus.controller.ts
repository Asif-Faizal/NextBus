import { Request, Response } from 'express';
import { BusService } from '../services/bus.service';
import { IBus } from '../interfaces/bus.interface';
import { logDebug } from '../utils/logger';

export class BusController {
  private busService: BusService;

  constructor() {
    this.busService = new BusService();
  }

  async getBusById(req: Request, res: Response): Promise<void> {
    try {
      const busId = req.params.busId;
      logDebug(`GET /api/buses/${busId} - Getting bus by ID`);
      
      const bus = await this.busService.getBusById(busId);
      logDebug(`Returning bus: ${bus.busName}`);
      
      res.json(bus);
    } catch (error) {
      logDebug(`Error getting bus by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(404).json({ message: error instanceof Error ? error.message : 'Bus not found' });
    }
  }

  async getAllBuses(req: Request, res: Response): Promise<void> {
    try {
      logDebug('GET /api/buses - Getting buses with filters');
      
      // Extract query parameters
      const queryOptions = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        busName: req.query.busName as string | undefined,
        busNumberPlate: req.query.busNumberPlate as string | undefined,
        status: req.query.status ? parseInt(req.query.status as string) : undefined,
        busType: req.query.busType as string | undefined,
        busSubType: req.query.busSubType as string | undefined
      };
      
      logDebug(`Query options: ${JSON.stringify(queryOptions)}`);
      const result = await this.busService.getAllBuses(queryOptions);
      
      logDebug(`Returning ${result.data.length} buses out of ${result.total}`);
      res.json(result);
    } catch (error) {
      logDebug(`Error getting buses: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  async getEditRequest(req: Request, res: Response): Promise<void> {
    try {
      const { busId } = req.params;
      const editRequest = await this.busService.getEditRequest(busId);
      res.json(editRequest);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to get edit request' });
    }
  }
} 