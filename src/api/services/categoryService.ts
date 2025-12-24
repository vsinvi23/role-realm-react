import apiClient from '../client';
import { ApiResponse, CategoryCreateDto, CategoryResponseDto, CategoryListResponse } from '../types';

const CATEGORIES_BASE = '/api/categories';

export const categoryService = {
  /**
   * Get list of categories (returns flat array with nested children)
   * GET /api/categories
   */
  getCategories: async (): Promise<CategoryListResponse> => {
    const response = await apiClient.get<ApiResponse<CategoryListResponse>>(CATEGORIES_BASE);
    return response.data.data || [];
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
