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
  token: string;
  message?: string;
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

// Legacy types for UI compatibility
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

// ============================================
// GROUP TYPES
// ============================================

export interface GroupCreateDto {
  name: string;
}

export interface GroupUserDto {
  id: number;
  name: string;
  email: string;
}

export interface GroupResponseDto {
  id: number;
  name: string;
  users: GroupUserDto[] | null;
}

export interface GroupPagedResponse {
  items: GroupResponseDto[];
  total: number;
  currentPage: number;
  pageSize: number;
}

// Legacy type for backwards compatibility
export interface GroupResponse {
  id: string;
  name: string;
  description: string | null;
  members?: UserResponse[];
}

// ============================================
// CATEGORY TYPES
// ============================================

export interface CategoryCreateDto {
  name: string;
}

export interface CategoryResponseDto {
  id: number;
  name: string;
  parentId: number | null;
}

export interface CategoryPagedResponse {
  items: CategoryResponseDto[];
  total: number;
  currentPage: number;
  pageSize: number;
}

// ============================================
// CMS TYPES
// ============================================

export type CmsType = 'ARTICLE' | 'COURSE';

export type CmsStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED';

export interface CmsCreateDto {
  type: CmsType;
  categoryId: number;
  createdBy?: number;
  contentLocation?: string;
}

export interface CmsResponseDto {
  id: number;
  type: CmsType;
  categoryId: number;
  status: CmsStatus;
  contentLocation: string | null;
  contentName: string | null;
  contentType: string | null;
  contentSize: number | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  reviewerId?: number;
  reviewerName?: string;
  reviewerComment?: string;
}

export interface CmsPagedResponse {
  items: CmsResponseDto[];
  total: number;
  currentPage: number;
  pageSize: number;
}

export interface CmsSubmitRequest {
  userId: number;
}

export interface CmsSendBackRequest {
  reviewerId: number;
  comment: string;
}

export interface StoredFileInfo {
  id: number;
  contentLocation: string;
  contentName: string;
  contentType: string;
  contentSize: number;
}

// ============================================
// ROLE TYPES (Legacy - for UI compatibility)
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
// PERMISSION TYPES (Legacy - for UI compatibility)
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
// API ERROR TYPE
// ============================================

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
