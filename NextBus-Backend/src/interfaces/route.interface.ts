import { Types } from 'mongoose';

export interface IStop {
  stopId: Types.ObjectId;
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
  stops: {
    stopId: string;
    time: string;
  }[];
}

export interface IRouteResponse {
  _id: string;
  routeName: string;
  busId: string;
  startTime: Date;
  endTime: Date;
  stops: {
    stopId: string;
    stopName: string;
    stopType: string;
    stopDistrict: string;
    time: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
} 