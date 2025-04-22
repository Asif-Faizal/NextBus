import { Route, IRouteDocument } from '../models/route.model';
import { IRoute } from '../interfaces/route.interface';
import { Types } from 'mongoose';

export class RouteRepository {
  async create(routeData: IRoute): Promise<IRouteDocument> {
    const route = new Route(routeData);
    return route.save();
  }

  async findById(id: string): Promise<IRouteDocument | null> {
    return Route.findById(id).populate('busId');
  }

  async findByBusId(busId: string): Promise<IRouteDocument[]> {
    return Route.find({ busId: new Types.ObjectId(busId) }).populate('busId');
  }

  async findAll(): Promise<IRouteDocument[]> {
    return Route.find().populate('busId');
  }

  async update(id: string, routeData: Partial<IRoute>): Promise<IRouteDocument | null> {
    return Route.findByIdAndUpdate(id, routeData, { new: true }).populate('busId');
  }

  async delete(id: string): Promise<IRouteDocument | null> {
    return Route.findByIdAndDelete(id);
  }
} 