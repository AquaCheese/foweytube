// Mock Video model for development
// This prevents build errors but uses mock data instead of actual database

export interface IVideo {
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
  createdAt: string;
}

// Mock Video model - no actual database operations
export const Video = {
  find: () => Promise.resolve([]),
  findById: () => Promise.resolve(null),
  findOne: () => Promise.resolve(null),
  create: () => Promise.resolve(null),
  findByIdAndUpdate: () => Promise.resolve(null),
  findByIdAndDelete: () => Promise.resolve(null),
};

export default Video;
