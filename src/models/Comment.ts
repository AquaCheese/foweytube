// Mock Comment model for development
// This prevents build errors but uses mock data instead of actual database

export interface IComment {
  _id: string;
  content: string;
  userId: string;
  videoId: string;
  parentId?: string;
  likes: string[];
  dislikes: string[];
  createdAt: string;
}

// Mock Comment model - no actual database operations
export const Comment = {
  find: () => Promise.resolve([]),
  findById: () => Promise.resolve(null),
  findOne: () => Promise.resolve(null),
  create: () => Promise.resolve(null),
  findByIdAndUpdate: () => Promise.resolve(null),
  findByIdAndDelete: () => Promise.resolve(null),
};

export default Comment;
