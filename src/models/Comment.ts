import mongoose, { Schema } from 'mongoose';
import { IComment } from '../types';

const CommentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    authorId: {
      type: String,
      required: true,
    },
    videoId: {
      type: String,
      required: true,
    },
    parentComment: {
      type: String,
      default: null,
    },
    replies: [{
      type: String,
    }],
    likes: [{
      type: String,
    }],
    dislikes: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

// Virtual for populating author
CommentSchema.virtual('author', {
  ref: 'User',
  localField: 'authorId',
  foreignField: '_id',
  justOne: true,
});

// Index for faster searches
CommentSchema.index({ videoId: 1, createdAt: -1 });
CommentSchema.index({ authorId: 1 });

export const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
