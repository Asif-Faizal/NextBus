import mongoose, { Schema, Document } from 'mongoose';
import { IRoute, IStop } from '../interfaces/route.interface';

export interface IRouteDocument extends IRoute, Document {}

const stopSchema = new Schema<IStop>({
  stopId: {
    type: Schema.Types.ObjectId,
    ref: 'Stop',
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
});

const routeSchema = new Schema<IRouteDocument>(
  {
    routeName: {
      type: String,
      required: true,
      trim: true,
    },
    busId: {
      type: Schema.Types.ObjectId,
      ref: 'Bus',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    stops: [stopSchema],
  },
  {
    timestamps: true,
  }
);

export const Route = mongoose.model<IRouteDocument>('Route', routeSchema); 