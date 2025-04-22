import { Request, Response } from 'express';
import { StopService } from '../services/stop.service';
import { IStopCreate } from '../interfaces/stop.interface';

export class StopController {
  private stopService: StopService;

  constructor() {
    this.stopService = new StopService();
  }

  async createStop(req: Request, res: Response): Promise<void> {
    try {
      const stopData: IStopCreate = req.body;
      const stop = await this.stopService.createStop(stopData);
      res.status(201).json(stop);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to create stop' });
    }
  }

  async getStopById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const stop = await this.stopService.getStopById(id);
      if (!stop) {
        res.status(404).json({ message: 'Stop not found' });
        return;
      }
      res.json(stop);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to get stop' });
    }
  }

  async getAllStops(req: Request, res: Response): Promise<void> {
    try {
      const stops = await this.stopService.getAllStops();
      res.json(stops);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to get stops' });
    }
  }

  async updateStop(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const stopData: Partial<IStopCreate> = req.body;
      const stop = await this.stopService.updateStop(id, stopData);
      if (!stop) {
        res.status(404).json({ message: 'Stop not found' });
        return;
      }
      res.json(stop);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to update stop' });
    }
  }

  async deleteStop(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.stopService.deleteStop(id);
      if (!success) {
        res.status(404).json({ message: 'Stop not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message.includes('Cannot delete stop as it is being used')) {
        res.status(409).json({ message: error.message });
      } else {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to delete stop' });
      }
    }
  }
} 