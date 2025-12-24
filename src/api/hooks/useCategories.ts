import { useQuery } from '@tanstack/react-query';
import { categoryService, CategoryQueryParams } from '../services/categoryService';

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
