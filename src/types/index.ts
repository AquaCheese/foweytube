import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  displayName: string;
  avatar?: string;
  subscribers: number;
  subscriptions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IVideo extends Document {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  views: number;
  likes: string[];
  dislikes: string[];
  uploaderId: string;
  uploader: IUser;
  tags: string[];
  category: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment extends Document {
  _id: string;
  content: string;
  authorId: string;
  author: IUser;
  videoId: string;
  parentComment?: string;
  replies: string[];
  likes: string[];
  dislikes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscription extends Document {
  _id: string;
  subscriberId: string;
  subscriber: IUser;
  channelId: string;
  channel: IUser;
  createdAt: Date;
}

export interface IPlaylist extends Document {
  _id: string;
  name: string;
  description: string;
  videos: string[];
  creatorId: string;
  creator: IUser;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
