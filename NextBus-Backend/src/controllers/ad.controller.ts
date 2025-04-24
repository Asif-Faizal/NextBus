import { Request, Response } from 'express';
import { AdService } from '../services/ad.service';
import { IAd } from '../interfaces/ad.interface';
import { logDebug } from '../utils/logger';

export class AdController {
  private adService: AdService;

  constructor() {
    this.adService = new AdService();
  }

  async getAdById(req: Request, res: Response): Promise<void> {
    try {
      const adId = req.params.adId;
      logDebug(`GET /api/ads/${adId} - Getting ad by ID`);
      
      const ad = await this.adService.getAdById(adId);
      logDebug(`Returning ad: ${ad.title}`);
      
      res.json(ad);
    } catch (error) {
      logDebug(`Error getting ad by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(404).json({ message: error instanceof Error ? error.message : 'Ad not found' });
    }
  }

  async getAllAds(req: Request, res: Response): Promise<void> {
    try {
      logDebug('GET /api/ads - Getting ads with filters');
      
      const queryOptions = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        title: req.query.title as string | undefined,
        adClientName: req.query.adClientName as string | undefined,
        status: req.query.status ? parseInt(req.query.status as string) : undefined,
        location: req.query.location as string | undefined,
      };
      
      logDebug(`Query options: ${JSON.stringify(queryOptions)}`);
      const result = await this.adService.getAllAds(queryOptions);
      
      logDebug(`Returning ${result.data.length} ads out of ${result.total}`);
      res.json(result);
    } catch (error) {
      logDebug(`Error getting ads: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to get ads' });
    }
  }

  async createAd(req: Request, res: Response): Promise<void> {
    try {
      const adData: IAd = req.body;
      const userId = req.userId!;
      const ad = await this.adService.createAd(adData, userId);
      res.status(201).json(ad);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to create ad' });
    }
  }

  async approveAd(req: Request, res: Response): Promise<void> {
    try {
      const { adId } = req.params;
      const userId = req.userId!;
      const ad = await this.adService.approveAd(adId, userId);
      res.json(ad);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to approve ad' });
    }
  }

  async requestEdit(req: Request, res: Response): Promise<void> {
    try {
      const { adId } = req.params;
      const userId = req.userId!;
      const newData: Partial<IAd> = req.body;
      const ad = await this.adService.requestEdit(adId, userId, newData);
      res.json(ad);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to request edit' });
    }
  }

  async requestDelete(req: Request, res: Response): Promise<void> {
    try {
      const { adId } = req.params;
      const userId = req.userId!;
      const ad = await this.adService.requestDelete(adId, userId);
      res.json(ad);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to request delete' });
    }
  }

  async approveEdit(req: Request, res: Response): Promise<void> {
    try {
      const { adId } = req.params;
      const userId = req.userId!;
      const ad = await this.adService.approveEdit(adId, userId);
      res.json(ad);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to approve edit' });
    }
  }

  async approveDelete(req: Request, res: Response): Promise<void> {
    try {
      const { adId } = req.params;
      const userId = req.userId!;
      await this.adService.approveDelete(adId, userId);
      res.json({ message: 'Ad deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to approve delete' });
    }
  }

  async rejectModification(req: Request, res: Response): Promise<void> {
    try {
      const { adId } = req.params;
      const userId = req.userId!;
      const ad = await this.adService.rejectModification(adId, userId);
      res.json(ad);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to reject modification' });
    }
  }

  async getAdHistory(req: Request, res: Response): Promise<void> {
    try {
      const { adId } = req.params;
      const history = await this.adService.getAdHistory(adId);
      res.json(history);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to get ad history' });
    }
  }

  async getPendingModifications(req: Request, res: Response): Promise<void> {
    try {
      const modifications = await this.adService.getPendingModifications();
      res.json(modifications);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to get pending modifications' });
    }
  }
} 