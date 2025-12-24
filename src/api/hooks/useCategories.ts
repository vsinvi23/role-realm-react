import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService, CategoryQueryParams } from '../services/categoryService';
import { CategoryCreateDto } from '../types';

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  list: (params?: CategoryQueryParams) => [...categoryKeys.all, 'list', params] as const,
  detail: (id: number) => [...categoryKeys.all, 'detail', id] as const,
};

/**
 * Hook to fetch paginated categories
 */
export const useCategories = (params?: CategoryQueryParams) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoryService.getCategories(params),
  });
};

/**
 * Hook to fetch a single category by ID
 */
export const useCategory = (id: number, enabled = true) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getCategory(id),
    enabled: enabled && id > 0,
  });
};

/**
 * Hook to create a new category
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
 * Hook to update an existing category
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryCreateDto }) =>
      categoryService.updateCategory(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};

/**
 * Hook to delete a category
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
