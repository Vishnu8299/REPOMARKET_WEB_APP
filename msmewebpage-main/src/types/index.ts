// User related types
export type UserRole = 'ADMIN' | 'DEVELOPER' | 'BUYER';

export interface User {
  bio: string;
  address: string;
  id: string;
  email: string;
  name: string;
  role: UserRole;
  active: boolean;
  organization: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
}

export interface UserUpdateData {
  name?: string;
  organization?: string;
  phoneNumber?: string;
}

// Project related types
export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  userId: string;
  organizationId?: string;
  price: number;
  downloads: number;
  createdAt: string;
  updatedAt: string;
}

export enum ProjectStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

export interface ProjectCreateData {
  name: string;
  description: string;
  visibility: string;
  addReadme: boolean;
  gitignoreTemplate: string;
  license: string;
  files?: File[];
  technologies?: string[];
}

export interface ProjectUpdateData {
  title?: string;
  description?: string;
  status?: ProjectStatus;
  price?: number;
}

// Hackathon related types
export interface Hackathon {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: HackathonStatus;
  organizerId: string;
  maxParticipants: number;
  createdAt: string;
  updatedAt: string;
}

export enum HackathonStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface HackathonCreateData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
}

export interface HackathonUpdateData {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: HackathonStatus;
  maxParticipants?: number;
}

// Auth related types
export interface LoginResponse {
  token: string;
  user: User;
}

// API Response types
export interface ApiResponse<T> {
  status: 'success' | 'error';
  success?: boolean;
  message?: string;
  data: T;
}

export interface ErrorResponse {
  status: 'error';
  message: string;
  data?: any;
}
