export enum BusStatus {
  CREATED = 1,
  APPROVED = 2,
  WAITING_FOR_EDIT = 3,
  WAITING_FOR_DELETE = 4
}

export interface IBus {
  busName: string;
  busNumberPlate: string;
  busOwnerName: string;
  busType: string;
  busSubType: string;
  driverName: string;
  conductorName: string;
  status: BusStatus;
  createdBy: string;
  approvedBy?: string;
  lastModifiedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBusHistory {
  busId: string;
  previousData: Partial<IBus>;
  newData: Partial<IBus>;
  modifiedBy: string;
  modificationType: 'EDIT' | 'DELETE';
  status: BusStatus;
  createdAt: Date;
}