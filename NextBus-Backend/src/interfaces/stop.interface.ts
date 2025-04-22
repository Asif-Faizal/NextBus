import { Types } from 'mongoose';

export interface IStop {
  name: string;
  type: 'bus-stop' | 'terminal' | 'depot';
  district: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IStopCreate {
  name: string;
  type: 'bus-stop' | 'terminal' | 'depot';
  district: string;
}

export interface IStopResponse {
  _id: string;
  name: string;
  type: 'bus-stop' | 'terminal' | 'depot';
  district: string;
  createdAt: Date;
  updatedAt: Date;
} 