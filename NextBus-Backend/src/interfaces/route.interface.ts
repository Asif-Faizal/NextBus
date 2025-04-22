import { Types } from 'mongoose';

export interface IStop {
  name: string;
  time: Date;
}

export interface IRoute {
  routeName: string;
  busId: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  stops: IStop[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRouteCreate {
  routeName: string;
  busId: string;
  startTime: string;
  endTime: string;
  stops: IStop[];
}

export interface IRouteResponse {
  _id: string;
  routeName: string;
  busId: string;
  startTime: Date;
  endTime: Date;
  stops: IStop[];
  createdAt: Date;
  updatedAt: Date;
} 