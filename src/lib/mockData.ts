// Mock data for testing without MongoDB
export const mockUsers = [
  {
    _id: '507f1f77bcf86cd799439011',
    username: 'testuser',
    email: 'test@example.com', 
    displayName: 'Test User',
    password: '$2b$12$LKnJ1LmGpB2I1Dsu3XRPlu7RqfeXB6gNusea4fwZsteYzpB1A6RWS', // password123
    avatar: null,
    subscribers: [],
    subscriptions: [],
    subscribersCount: 0,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '507f1f77bcf86cd799439017',
    username: 'johndoe',
    email: 'john@example.com', 
    displayName: 'John Doe',
    password: '$2b$12$LKnJ1LmGpB2I1Dsu3XRPlu7RqfeXB6gNusea4fwZsteYzpB1A6RWS', // password123
    avatar: null,
    subscribers: [],
    subscriptions: [],
    subscribersCount: 0,
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

export const mockVideos = [
  {
    _id: '507f1f77bcf86cd799439012',
    title: 'Welcome to FoweyTube!',
    description: 'This is a sample video to showcase the platform features.',
    thumbnail: '/placeholder-thumbnail.svg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    uploaderId: '507f1f77bcf86cd799439011',
    tags: ['welcome', 'demo'],
    views: 1250,
    likes: 42,
    dislikes: 2,
    likedBy: [],
    dislikedBy: [],
    duration: 180,
    isPublic: true,
    createdAt: '2024-01-02T00:00:00.000Z'
  },
  {
    _id: '507f1f77bcf86cd799439013',
    title: 'Getting Started Guide',
    description: 'Learn how to use all the features of FoweyTube in this comprehensive guide.',
    thumbnail: '/placeholder-thumbnail.svg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    uploaderId: '507f1f77bcf86cd799439011',
    tags: ['tutorial', 'guide'],
    views: 823,
    likes: 31,
    dislikes: 1,
    likedBy: [],
    dislikedBy: [],
    duration: 240,
    isPublic: true,
    createdAt: '2024-01-03T00:00:00.000Z'
  },
  {
    _id: '507f1f77bcf86cd799439014',
    title: 'Channel Customization Tips',
    description: 'Make your channel stand out with these customization tips and tricks.',
    thumbnail: '/placeholder-thumbnail.svg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    uploaderId: '507f1f77bcf86cd799439011',
    tags: ['customization', 'tips'],
    views: 567,
    likes: 28,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
    duration: 195,
    isPublic: true,
    createdAt: '2024-01-04T00:00:00.000Z'
  }
];

export const mockComments = [
  {
    _id: '507f1f77bcf86cd799439015',
    content: 'Great video! Very helpful.',
    videoId: '507f1f77bcf86cd799439012',
    authorId: '507f1f77bcf86cd799439011',
    likes: 5,
    createdAt: '2024-01-05T00:00:00.000Z'
  },
  {
    _id: '507f1f77bcf86cd799439016',
    content: 'Thanks for the tutorial!',
    videoId: '507f1f77bcf86cd799439012',
    authorId: '507f1f77bcf86cd799439017',
    likes: 3,
    createdAt: '2024-01-05T01:00:00.000Z'
  },
  {
    _id: '507f1f77bcf86cd799439018',
    content: 'This really helped me understand the concept.',
    videoId: '507f1f77bcf86cd799439013',
    authorId: '507f1f77bcf86cd799439011',
    likes: 7,
    createdAt: '2024-01-04T10:00:00.000Z'
  }
];
