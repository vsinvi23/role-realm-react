import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService, CategoryQueryParams } from '../services/categoryService';
import { CategoryCreateDto } from '../types';

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  list: (params?: CategoryQueryParams) => [...categoryKeys.all, 'list', params] as const,
};

/**
 * Hook to fetch categories
 */
export const useCategories = (params?: CategoryQueryParams) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoryService.getCategories(params),
  });
};

/**
 * Hook to create a new category (admin only)
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CategoryCreateDto) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};

/**
 * Hook to delete a category (admin only)
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};
