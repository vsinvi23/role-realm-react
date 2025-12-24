import apiClient from '../client';
import { ApiResponse, CategoryCreateDto, CategoryResponseDto, CategoryListResponse, PagedResponse } from '../types';

const CATEGORIES_BASE = '/api/categories';

export interface CategoryQueryParams {
  page?: number;
  size?: number;
}

export interface CategoryPagedResponse {
  items: CategoryResponseDto[];
  totalElements: number;
  page: number;
  size: number;
}

// Helper to extract array from various response formats
const extractCategoriesArray = (data: unknown): CategoryResponseDto[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  // Handle paged response format { items: [...] }
  if (typeof data === 'object' && 'items' in (data as object)) {
    return (data as PagedResponse<CategoryResponseDto>).items || [];
  }
  // Handle { data: [...] } format
  if (typeof data === 'object' && 'data' in (data as object)) {
    const nestedData = (data as { data: unknown }).data;
    if (Array.isArray(nestedData)) return nestedData;
  }
  return [];
};

export const categoryService = {
  /**
   * Get list of categories (returns flat array with nested children)
   * GET /api/categories
   */
  getCategories: async (): Promise<CategoryListResponse> => {
    const response = await apiClient.get<ApiResponse<unknown>>(CATEGORIES_BASE);
    return extractCategoriesArray(response.data.data);
  },

  /**
   * Get paginated list of categories
   * GET /api/categories?page=0&size=10
   */
  getCategoriesPaged: async (params?: CategoryQueryParams): Promise<CategoryPagedResponse> => {
    const response = await apiClient.get<ApiResponse<CategoryPagedResponse>>(CATEGORIES_BASE, {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
      },
    });
    return response.data.data || { items: [], totalElements: 0, page: 0, size: 10 };
  },

  /**
   * Get a single category by ID
   * GET /api/categories/:id
   */
  getCategory: async (id: number): Promise<CategoryResponseDto> => {
    const response = await apiClient.get<ApiResponse<CategoryResponseDto>>(`${CATEGORIES_BASE}/${id}`);
    return response.data.data!;
  },

  /**
   * Create a new category (admin only)
   * POST /api/categories
   */
  createCategory: async (data: CategoryCreateDto): Promise<CategoryResponseDto> => {
    const response = await apiClient.post<ApiResponse<CategoryResponseDto>>(CATEGORIES_BASE, data);
    return response.data.data!;
  },

  /**
   * Update a category (admin only)
   * PUT /api/categories/:id
   */
  updateCategory: async (id: number, data: CategoryCreateDto): Promise<CategoryResponseDto> => {
    const response = await apiClient.put<ApiResponse<CategoryResponseDto>>(`${CATEGORIES_BASE}/${id}`, data);
    return response.data.data!;
  },

  /**
   * Delete a category (admin only)
   * DELETE /api/categories/:id
   */
  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`${CATEGORIES_BASE}/${id}`);
  },
};

export default categoryService;
