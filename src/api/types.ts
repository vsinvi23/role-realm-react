// API Types based on OpenAPI specification (GeekGully API v1.0.0)

// ============================================
// GENERIC API RESPONSE WRAPPER
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

// ============================================
// AUTH TYPES
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  mobileNo?: string;
}

export interface AuthResponse {
  userId: number;
  email: string;
  message: string;
  token: string;
}

// ============================================
// USER TYPES
// ============================================

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'DEACTIVATED';

export interface UserDto {
  id: number;
  email: string;
  name: string;
  mobileNo?: string;
  status: string;
  lastLogin: string | null;
  createdAt: string;
  groups: string[];
}

export interface PagedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export interface UserQueryParams {
  page?: number;
  size?: number;
  status?: UserStatus;
  search?: string;
}

// Legacy types for backwards compatibility
export interface UserRequest {
  name: string;
  email: string;
  password?: string;
  status: UserStatus;
  mobileNo?: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  lastLogin: string | null;
  createdAt: string;
  mobileNo?: string;
  groups?: string[];
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// ============================================
// CMS TYPES
// ============================================

export type CmsType = 'ARTICLE' | 'COURSE';

export type CmsStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED';

export interface CmsCreateDto {
  type: CmsType;
  categoryId: number;
  contentLocation?: string;
  createdBy: number;
}

export interface CmsResponseDto {
  id: number;
  type: CmsType;
  categoryId: number;
  status: CmsStatus;
  contentLocation: string;
  contentName: string;
  contentType: string;
  contentSize: number;
  thumbnailLocation?: string;
  thumbnailName?: string;
  thumbnailType?: string;
  thumbnailSize?: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  reviewerComment?: string;
  reviewerId?: number;
  reviewerName?: string;
}

export interface CmsSubmitRequest {
  userId: number;
}

export interface CmsPublishRequest {
  userId: number;
}

export interface CmsSendBackRequest {
  reviewerId: number;
  comment: string;
}

export interface StoredFileInfo {
  path: string;
  originalName: string;
  contentType: string;
  size: number;
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
// CATEGORY TYPES
// ============================================

export interface CategoryDto {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCreateDto {
  name: string;
  description?: string;
  parentId?: number;
}

// ============================================
// API ERROR TYPE
// ============================================

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
