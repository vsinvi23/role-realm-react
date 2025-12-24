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
// PAGED RESPONSE (matches backend PagedResponse)
// ============================================

export interface PagedResponse<T> {
  items: T[];
  total: number;
  currentPage: number;
  pageSize: number;
  // Legacy aliases for compatibility
  totalElements?: number;
  page?: number;
  size?: number;
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

export type UserPagedResponse = PagedResponse<UserDto>;

// Legacy UserResponse for UI compatibility
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

export type GroupPagedResponse = PagedResponse<GroupResponseDto>;

// ============================================
// CATEGORY TYPES
// ============================================

export interface CategoryCreateDto {
  name: string;
  parentId?: number | null;
}

export interface CategoryResponseDto {
  id: number;
  name: string;
  parentId: number | null;
  children?: CategoryResponseDto[];
}

// Categories response is a flat array, not paged
export type CategoryListResponse = CategoryResponseDto[];

// ============================================
// CMS TYPES
// ============================================

export type CmsType = 'ARTICLE' | 'VIDEO' | 'COURSE';

export type CmsStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED';

export interface CmsCreateDto {
  type: CmsType;
  categoryId: number;
  createdBy?: number;
  title?: string;
  description?: string;
}

export interface CmsUpdateDto {
  title?: string;
  description?: string;
}

export interface CmsResponseDto {
  id: number;
  type: CmsType;
  categoryId: number;
  status: CmsStatus;
  title: string | null;
  description: string | null;
  contentLocation: string | null;
  contentName: string | null;
  contentType: string | null;
  contentSize: number | null;
  thumbnailLocation: string | null;
  thumbnailName: string | null;
  thumbnailType: string | null;
  thumbnailSize: number | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  reviewerId?: number;
  reviewerName?: string;
  reviewerComment?: string;
}

export type CmsPagedResponse = PagedResponse<CmsResponseDto>;

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
  location: string;
  name: string;
  size: number;
  type: string;
}

// ============================================
// API ERROR TYPE
// ============================================

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
