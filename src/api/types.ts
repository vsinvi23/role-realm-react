// API Types based on OpenAPI specification

// ============================================
// AUTH TYPES
// ============================================

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthSignupRequest {
  name: string;
  email: string;
  password: string;
  status: UserStatus;
}

export interface AuthTokenResponse {
  token: string;
}

// ============================================
// USER TYPES
// ============================================

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'DEACTIVATED';

export interface UserRequest {
  name: string;
  email: string;
  password?: string;
  status: UserStatus;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  lastLogin: string | null;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface UserQueryParams {
  page?: number;
  size?: number;
  status?: UserStatus;
  search?: string;
}

// ============================================
// ROLE TYPES
// ============================================

export interface RoleRequest {
  name: string;
  system?: boolean;
}

export interface RoleResponse {
  id: string;
  name: string;
  system: boolean;
}

// ============================================
// PERMISSION TYPES
// ============================================

export interface PermissionRequest {
  module: string;
  view?: boolean;
  create?: boolean;
  edit?: boolean;
  delete?: boolean;
  publish?: boolean;
  manage?: boolean;
}

export interface PermissionResponse {
  id: string;
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  publish: boolean;
  manage: boolean;
}

// ============================================
// GROUP TYPES
// ============================================

export interface GroupRequest {
  name: string;
  description?: string;
}

export interface GroupResponse {
  id: string;
  name: string;
  description: string | null;
  members?: UserResponse[];
}

// ============================================
// API ERROR TYPE
// ============================================

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
