import { RouteRepository } from '../repositories/route.repository';
import { IRoute, IRouteCreate, IRouteResponse } from '../interfaces/route.interface';
import { Types } from 'mongoose';
import { IRouteDocument } from '../models/route.model';

export class RouteService {
  private routeRepository: RouteRepository;

  constructor() {
    this.routeRepository = new RouteRepository();
  }

  private mapToResponse(route: IRouteDocument): IRouteResponse {
    return {
      _id: route._id.toString(),
      routeName: route.routeName,
      busId: route.busId.toString(),
      startTime: route.startTime,
      endTime: route.endTime,
      stops: route.stops,
      createdAt: route.createdAt!,
      updatedAt: route.updatedAt!,
    };
  }

  async createRoute(routeData: IRouteCreate): Promise<IRouteResponse> {
    const route: IRoute = {
      ...routeData,
      busId: new Types.ObjectId(routeData.busId),
      startTime: new Date(routeData.startTime),
      endTime: new Date(routeData.endTime),
      stops: routeData.stops.map(stop => ({
        ...stop,
        time: new Date(stop.time)
      }))
    };

    const createdRoute = await this.routeRepository.create(route);
    return this.mapToResponse(createdRoute);
  }

  async getRouteById(id: string): Promise<IRouteResponse | null> {
    const route = await this.routeRepository.findById(id);
    return route ? this.mapToResponse(route) : null;
  }

  async getRoutesByBusId(busId: string): Promise<IRouteResponse[]> {
    const routes = await this.routeRepository.findByBusId(busId);
    return routes.map(route => this.mapToResponse(route));
  }

  async getAllRoutes(): Promise<IRouteResponse[]> {
    const routes = await this.routeRepository.findAll();
    return routes.map(route => this.mapToResponse(route));
  }

  async updateRoute(id: string, routeData: Partial<IRouteCreate>): Promise<IRouteResponse | null> {
    const updateData: Partial<IRoute> = {};

    if (routeData.routeName) updateData.routeName = routeData.routeName;
    if (routeData.busId) updateData.busId = new Types.ObjectId(routeData.busId);
    if (routeData.startTime) updateData.startTime = new Date(routeData.startTime);
    if (routeData.endTime) updateData.endTime = new Date(routeData.endTime);
    if (routeData.stops) {
      updateData.stops = routeData.stops.map(stop => ({
        ...stop,
        time: new Date(stop.time)
      }));
    }

    const updatedRoute = await this.routeRepository.update(id, updateData);
    return updatedRoute ? this.mapToResponse(updatedRoute) : null;
  }

  async deleteRoute(id: string): Promise<boolean> {
    const result = await this.routeRepository.delete(id);
    return !!result;
  }
} 