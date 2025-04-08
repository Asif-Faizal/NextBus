import mongoose, { Schema, Document } from 'mongoose';
import { IBus, BusStatus } from '../interfaces/bus.interface';

export interface IBusDocument extends IBus, Document {}

const busSchema = new Schema<IBusDocument>(
  {
    busName: {
      type: String,
      required: true,
      trim: true,
    },
    busNumberPlate: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    busOwnerName: {
      type: String,
      required: true,
      trim: true,
    },
    busType: {
      type: String,
      required: true,
      trim: true,
    },
    busSubType: {
      type: String,
      required: true,
      trim: true,
    },
    driverName: {
      type: String,
      required: true,
      trim: true,
    },
    conductorName: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Number,
      enum: [BusStatus.CREATED, BusStatus.APPROVED, BusStatus.WAITING_FOR_EDIT, BusStatus.WAITING_FOR_DELETE],
      default: BusStatus.CREATED,
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
busSchema.pre('save', function(next) {
  if (this.isModified('createdBy')) {
    console.error(`[DEBUG] WARNING: Attempting to modify createdBy`);
    // Store the original createdBy value
    const originalCreatedBy = this.get('createdBy');
    this.set('createdBy', originalCreatedBy); // Restore the original createdBy
  }
  next();
});

// Add a pre-findOneAndUpdate hook to ensure createdBy cannot be modified
busSchema.pre('findOneAndUpdate', function() {
  const update = this.getUpdate() as any;
  if (update && update.$set && update.$set.createdBy) {
    console.error(`[DEBUG] WARNING: Attempting to modify createdBy in findOneAndUpdate`);
    delete update.$set.createdBy; // Remove createdBy from update
  }
});

export const Bus = mongoose.model<IBusDocument>('Bus', busSchema); 