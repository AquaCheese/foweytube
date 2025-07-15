import mongoose, { Schema } from 'mongoose';
import { IVideo } from '../types';

const VideoSchema = new Schema<IVideo>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      default: '',
      maxlength: 5000,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [{
      type: String,
    }],
    dislikes: [{
      type: String,
    }],
    uploaderId: {
      type: String,
      required: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    category: {
      type: String,
      default: 'Entertainment',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for populating uploader
VideoSchema.virtual('uploader', {
  ref: 'User',
  localField: 'uploaderId',
  foreignField: '_id',
  justOne: true,
});

// Index for faster searches
VideoSchema.index({ title: 'text', description: 'text', tags: 'text' });
VideoSchema.index({ uploaderId: 1 });
VideoSchema.index({ createdAt: -1 });
VideoSchema.index({ views: -1 });

export const Video = mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);
