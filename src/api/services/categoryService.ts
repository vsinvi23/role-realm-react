import apiClient from '../client';
import { ApiResponse, CategoryResponseDto, CategoryPagedResponse } from '../types';

const CATEGORIES_BASE = '/api/categories';

export interface CategoryQueryParams {
  page?: number;
  size?: number;
}

export const categoryService = {
  /**
   * Get paginated list of categories
   * GET /api/categories?page=0&size=10
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
   * Get a single category by ID
   * GET /api/categories/:id
   */
  getCategory: async (categoryId: number): Promise<CategoryResponseDto> => {
    const response = await apiClient.get<ApiResponse<CategoryResponseDto>>(`${CATEGORIES_BASE}/${categoryId}`);
    return response.data.data!;
  },
};

export default categoryService;
