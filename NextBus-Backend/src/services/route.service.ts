import { RouteRepository } from '../repositories/route.repository';
import { IRoute, IRouteCreate, IRouteResponse } from '../interfaces/route.interface';
import { Types } from 'mongoose';
import { IRouteDocument } from '../models/route.model';
import { StopService } from './stop.service';

export class RouteService {
  private routeRepository: RouteRepository;
  private stopService: StopService;

  constructor() {
    this.routeRepository = new RouteRepository();
    this.stopService = new StopService();
  }

  private async mapToResponse(route: IRouteDocument): Promise<IRouteResponse> {
    const stopsWithDetails = await Promise.all(
      route.stops.map(async (stop) => {
        const stopDetails = await this.stopService.getStopById(stop.stopId.toString());
        if (!stopDetails) {
          throw new Error(`Stop with ID ${stop.stopId} not found`);
        }
        return {
          stopId: stop.stopId.toString(),
          stopName: stopDetails.name,
          stopType: stopDetails.type,
          stopDistrict: stopDetails.district,
          time: stop.time,
        };
      })
    );

    return {
      _id: route._id.toString(),
      routeName: route.routeName,
      busId: route.busId.toString(),
      startTime: route.startTime,
      endTime: route.endTime,
      stops: stopsWithDetails,
      createdAt: route.createdAt!,
      updatedAt: route.updatedAt!,
    };
  }

  async createRoute(routeData: IRouteCreate): Promise<IRouteResponse> {
    // Validate all stops exist
    await Promise.all(
      routeData.stops.map(async (stop) => {
        const stopExists = await this.stopService.getStopById(stop.stopId);
        if (!stopExists) {
          throw new Error(`Stop with ID ${stop.stopId} not found`);
        }
      })
    );

    const route: IRoute = {
      ...routeData,
      busId: new Types.ObjectId(routeData.busId),
      startTime: new Date(routeData.startTime),
      endTime: new Date(routeData.endTime),
      stops: routeData.stops.map(stop => ({
        stopId: new Types.ObjectId(stop.stopId),
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
    return Promise.all(routes.map(route => this.mapToResponse(route)));
  }

  async getAllRoutes(): Promise<IRouteResponse[]> {
    const routes = await this.routeRepository.findAll();
    return Promise.all(routes.map(route => this.mapToResponse(route)));
  }

  async updateRoute(id: string, routeData: Partial<IRouteCreate>): Promise<IRouteResponse | null> {
    const updateData: Partial<IRoute> = {};

    if (routeData.routeName) updateData.routeName = routeData.routeName;
    if (routeData.busId) updateData.busId = new Types.ObjectId(routeData.busId);
    if (routeData.startTime) updateData.startTime = new Date(routeData.startTime);
    if (routeData.endTime) updateData.endTime = new Date(routeData.endTime);
    if (routeData.stops) {
      // Validate all stops exist
      await Promise.all(
        routeData.stops.map(async (stop) => {
          const stopExists = await this.stopService.getStopById(stop.stopId);
          if (!stopExists) {
            throw new Error(`Stop with ID ${stop.stopId} not found`);
          }
        })
      );

      updateData.stops = routeData.stops.map(stop => ({
        stopId: new Types.ObjectId(stop.stopId),
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