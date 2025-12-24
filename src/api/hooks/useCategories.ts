import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';
import { CategoryDto, CategoryCreateDto } from '../types';

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  detail: (id: number) => [...categoryKeys.all, id] as const,
  children: (parentId: number) => [...categoryKeys.all, 'children', parentId] as const,
};

/**
 * Hook to fetch all categories
 */
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: () => categoryService.getCategories(),
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
 * Hook to fetch subcategories of a parent
 */
export const useSubcategories = (parentId: number, enabled = true) => {
  return useQuery({
    queryKey: categoryKeys.children(parentId),
    queryFn: () => categoryService.getSubcategories(parentId),
    enabled: enabled && parentId > 0,
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
 * Hook to update a category
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
