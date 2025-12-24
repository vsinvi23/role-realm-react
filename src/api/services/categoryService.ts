import apiClient from '../client';
import { ApiResponse, CategoryCreateDto, CategoryResponseDto, CategoryPagedResponse } from '../types';

const CATEGORIES_BASE = '/api/categories';

export interface CategoryQueryParams {
  page?: number;
  size?: number;
}

export const categoryService = {
  /**
   * Get list of categories
   * GET /api/categories
   */
  getCategories: async (params?: CategoryQueryParams): Promise<CategoryPagedResponse> => {
    const response = await apiClient.get<ApiResponse<CategoryPagedResponse>>(CATEGORIES_BASE, {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
      },
    });
    return response.data.data || { items: [], total: 0, currentPage: 0, pageSize: 10 };
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
