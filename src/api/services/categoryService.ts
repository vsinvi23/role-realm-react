import apiClient from '../client';
import { ApiResponse, CategoryDto, CategoryCreateDto } from '../types';

const CATEGORIES_BASE = '/api/categories';

export const categoryService = {
  /**
   * Get all categories
   * GET /api/categories
   */
  getCategories: async (): Promise<CategoryDto[]> => {
    const response = await apiClient.get<ApiResponse<CategoryDto[]>>(CATEGORIES_BASE);
    return response.data.data || [];
  },

  /**
   * Get a single category by ID
   * GET /api/categories/:id
   */
  getCategory: async (categoryId: number): Promise<CategoryDto> => {
    const response = await apiClient.get<ApiResponse<CategoryDto>>(`${CATEGORIES_BASE}/${categoryId}`);
    return response.data.data!;
  },

  /**
   * Create a new category
   * POST /api/categories
   */
  createCategory: async (data: CategoryCreateDto): Promise<CategoryDto> => {
    const response = await apiClient.post<ApiResponse<CategoryDto>>(CATEGORIES_BASE, data);
    return response.data.data!;
  },

  /**
   * Update an existing category
   * PUT /api/categories/:id
   */
  updateCategory: async (categoryId: number, data: CategoryCreateDto): Promise<CategoryDto> => {
    const response = await apiClient.put<ApiResponse<CategoryDto>>(`${CATEGORIES_BASE}/${categoryId}`, data);
    return response.data.data!;
  },

  /**
   * Delete a category
   * DELETE /api/categories/:id
   */
  deleteCategory: async (categoryId: number): Promise<void> => {
    await apiClient.delete(`${CATEGORIES_BASE}/${categoryId}`);
  },

  /**
   * Get subcategories of a parent category
   * GET /api/categories/:id/children
   */
  getSubcategories: async (parentId: number): Promise<CategoryDto[]> => {
    const response = await apiClient.get<ApiResponse<CategoryDto[]>>(`${CATEGORIES_BASE}/${parentId}/children`);
    return response.data.data || [];
  },
};

export default categoryService;
