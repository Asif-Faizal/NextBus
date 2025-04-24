export enum AdStatus {
  CREATED = 1,
  APPROVED = 2,
  WAITING_FOR_EDIT = 3,
  WAITING_FOR_DELETE = 4
}

export interface IAd {
  title: string;
  imageUrl: string;
  adClientName: string;
  duration: number; // in days
  location: string;
  redirectionUrl: string;
  status: AdStatus;
  createdBy: string;
  approvedBy?: string;
  lastModifiedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAdHistory {
  adId: string;
  previousData: Partial<IAd>;
  newData: Partial<IAd>;
  modifiedBy: string;
  modificationType: 'EDIT' | 'DELETE';
  status: AdStatus;
  createdAt: Date;
} 