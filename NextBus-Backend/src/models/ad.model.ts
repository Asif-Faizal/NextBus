import mongoose, { Schema, Document } from 'mongoose';
import { IAd, AdStatus } from '../interfaces/ad.interface';

export interface IAdDocument extends IAd, Document {}

const adSchema = new Schema<IAdDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    adClientName: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    redirectionUrl: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Number,
      enum: [AdStatus.CREATED, AdStatus.APPROVED, AdStatus.WAITING_FOR_EDIT, AdStatus.WAITING_FOR_DELETE],
      default: AdStatus.CREATED,
    },
    createdBy: {
      type: String,
      required: true,
      immutable: true,
    },
    approvedBy: {
      type: String,
    },
    lastModifiedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Add a pre-save hook to ensure createdBy cannot be modified
adSchema.pre('save', function(next) {
  if (this.isModified('createdBy')) {
    console.error(`[DEBUG] WARNING: Attempting to modify createdBy`);
    const originalCreatedBy = this.get('createdBy');
    this.set('createdBy', originalCreatedBy);
  }
  next();
});

// Add a pre-findOneAndUpdate hook to ensure createdBy cannot be modified
adSchema.pre('findOneAndUpdate', function() {
  const update = this.getUpdate() as any;
  if (update && update.$set && update.$set.createdBy) {
    console.error(`[DEBUG] WARNING: Attempting to modify createdBy in findOneAndUpdate`);
    delete update.$set.createdBy;
  }
});

export const Ad = mongoose.model<IAdDocument>('Ad', adSchema); 