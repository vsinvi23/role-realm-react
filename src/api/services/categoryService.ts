import apiClient from '../client';
import { ApiResponse, CategoryCreateDto, CategoryResponseDto, CategoryListResponse, PagedResponse } from '../types';

const CATEGORIES_BASE = '/api/categories';

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
   * Create a new category (admin only)
   * POST /api/categories
   */
  createCategory: async (data: CategoryCreateDto): Promise<CategoryResponseDto> => {
    const response = await apiClient.post<ApiResponse<CategoryResponseDto>>(CATEGORIES_BASE, data);
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
