import apiClient from '../client';
import { 
  ApiResponse, 
  CategoryResponseDto, 
  CategoryPagedResponse, 
  CategoryCreateDto 
} from '../types';

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

  /**
   * Create a new category
   * POST /api/categories
   */
  createCategory: async (data: CategoryCreateDto): Promise<CategoryResponseDto> => {
    const response = await apiClient.post<ApiResponse<CategoryResponseDto>>(CATEGORIES_BASE, data);
    return response.data.data!;
  },

  /**
   * Update an existing category
   * PUT /api/categories/:id
   */
  updateCategory: async (categoryId: number, data: CategoryCreateDto): Promise<CategoryResponseDto> => {
    const response = await apiClient.put<ApiResponse<CategoryResponseDto>>(`${CATEGORIES_BASE}/${categoryId}`, data);
    return response.data.data!;
  },

  /**
   * Delete a category
   * DELETE /api/categories/:id
   */
  deleteCategory: async (categoryId: number): Promise<void> => {
    await apiClient.delete(`${CATEGORIES_BASE}/${categoryId}`);
  },
};

export default categoryService;
