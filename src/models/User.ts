// Mock User model for development
// This prevents build errors but uses mock data instead of actual database

export interface IUser {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  password: string;
  subscribers: string[];
  subscriptions: string[];
  createdAt: string;
}

// Mock User model - no actual database operations
export const User = {
  find: () => Promise.resolve([]),
  findById: () => Promise.resolve(null),
  findOne: () => Promise.resolve(null),
  create: () => Promise.resolve(null),
  findByIdAndUpdate: () => Promise.resolve(null),
  findByIdAndDelete: () => Promise.resolve(null),
};

export default User;
