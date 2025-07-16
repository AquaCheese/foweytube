import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { mockUsers } from './mockData';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const secret = new TextEncoder().encode(JWT_SECRET);

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export async function generateToken(userId: string): Promise<string> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
  
  return token;
}

export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string };
  } catch (error) {
    return null;
  }
}

// In-memory storage for new users (in production, this would be a database)
let registeredUsers: any[] = [...mockUsers];

export async function createUser(userData: {
  username: string;
  email: string;
  password: string;
  displayName: string;
}) {
  // Check if user already exists
  const existingUser = registeredUsers.find(
    user => user.email === userData.email || user.username === userData.username
  );
  
  if (existingUser) {
    if (existingUser.email === userData.email) {
      throw new Error('Email already exists');
    }
    if (existingUser.username === userData.username) {
      throw new Error('Username already taken');
    }
  }
  
  // Hash password
  const hashedPassword = await hashPassword(userData.password);
  
  // Create user
  const newUser = {
    _id: `user_${Date.now()}`,
    ...userData,
    password: hashedPassword,
    avatar: null,
    subscribers: [],
    subscriptions: [],
    subscribersCount: 0,
    createdAt: new Date().toISOString()
  };
  
  registeredUsers.push(newUser);
  
  return {
    id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    displayName: newUser.displayName,
    avatar: newUser.avatar,
    subscribers: newUser.subscribers,
  };
}

export async function authenticateUser(email: string, password: string) {
  const user = registeredUsers.find(u => u.email === email);
  if (!user) {
    throw new Error('User not found');
  }
  
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    throw new Error('Invalid password');
  }
  
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    avatar: user.avatar,
    subscribers: user.subscribers,
  };
}

export async function getUserById(userId: string) {
  const user = registeredUsers.find(u => u._id === userId);
  if (!user) {
    return null;
  }
  
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    avatar: user.avatar,
    subscribers: user.subscribers,
    subscriptions: user.subscriptions,
  };
}

export async function getUserByEmail(email: string) {
  const user = registeredUsers.find(u => u.email === email);
  if (!user) {
    return null;
  }
  
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    avatar: user.avatar,
    subscribers: user.subscribers,
    subscriptions: user.subscriptions,
    password: user.password // Include password for authentication
  };
}
