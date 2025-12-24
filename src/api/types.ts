// API Types based on CMS API Documentation

// ============================================
// GENERIC API RESPONSE WRAPPER
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

// ============================================
// PAGED RESPONSE
// ============================================

export interface PagedResponse<T> {
  items: T[];
  totalElements: number;
  currentPage: number;
  pageSize: number;
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

export type UserPagedResponse = PagedResponse<UserDto>;

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

export type CategoryListResponse = CategoryResponseDto[];

// ============================================
// CMS TYPES (per API documentation)
// ============================================

export type CmsType = 'ARTICLE' | 'VIDEO' | 'COURSE';

// Status values: DRAFT | REVIEW | PUBLISHED
export type CmsStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED';

export interface CmsCreateDto {
  type: CmsType;
  categoryId: number;
  createdBy?: number;
  title?: string;
  description?: string;
}

export interface CmsUpdateDto {
  type?: CmsType;
  categoryId?: number;
  title?: string;
  description?: string;
}

export interface CmsResponseDto {
  id: number;
  type: CmsType;
  categoryId: number;
  createdBy: number;
  reviewerId: number | null;
  reviewerName: string | null;
  reviewerComment: string | null;
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
  createdAt: string;
  updatedAt: string | null;
}

export type CmsPagedResponse = PagedResponse<CmsResponseDto>;

export interface CmsSubmitRequest {
  userId?: number;
}

export interface CmsPublishRequest {
  userId?: number;
}

export interface CmsSendBackRequest {
  reviewerId: number;
  comment: string;
}

// ============================================
// API ERROR TYPE
// ============================================

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
