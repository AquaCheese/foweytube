// Mock MongoDB connection for development
// This file exists to prevent build errors but doesn't actually connect to MongoDB

export const connectDB = async () => {
  // Mock connection - no actual database
  console.log('Using mock data instead of MongoDB');
  return Promise.resolve();
};

export default { connectDB };
