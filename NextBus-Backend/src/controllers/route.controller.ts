import { Request, Response } from 'express';
import { RouteService } from '../services/route.service';
import { IRouteCreate } from '../interfaces/route.interface';

export class RouteController {
  private routeService: RouteService;

  constructor() {
    this.routeService = new RouteService();
  }

  async createRoute(req: Request, res: Response): Promise<void> {
    try {
      const routeData: IRouteCreate = req.body;
      const route = await this.routeService.createRoute(routeData);
      res.status(201).json(route);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to create route' });
    }
  }

  async getRouteById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const route = await this.routeService.getRouteById(id);
      if (!route) {
        res.status(404).json({ message: 'Route not found' });
        return;
      }
      res.json(route);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to get route' });
    }
  }

  async getRoutesByBusId(req: Request, res: Response): Promise<void> {
    try {
      const { busId } = req.params;
      const routes = await this.routeService.getRoutesByBusId(busId);
      res.json(routes);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to get routes' });
    }
  }

  async getAllRoutes(req: Request, res: Response): Promise<void> {
    try {
      const routes = await this.routeService.getAllRoutes();
      res.json(routes);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to get routes' });
    }
  }

  async updateRoute(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const routeData: Partial<IRouteCreate> = req.body;
      const route = await this.routeService.updateRoute(id, routeData);
      if (!route) {
        res.status(404).json({ message: 'Route not found' });
        return;
      }
      res.json(route);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to update route' });
    }
  }

  async deleteRoute(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.routeService.deleteRoute(id);
      if (!success) {
        res.status(404).json({ message: 'Route not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to delete route' });
    }
  }
} 