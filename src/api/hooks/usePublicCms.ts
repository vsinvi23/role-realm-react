import { useQuery } from '@tanstack/react-query';
import { publicCmsService, PublicCmsQueryParams } from '../services/publicCmsService';

// Query keys for public CMS
export const publicCmsKeys = {
  all: ['public-cms'] as const,
  list: (params?: PublicCmsQueryParams) => [...publicCmsKeys.all, 'list', params] as const,
  detail: (id: number) => [...publicCmsKeys.all, id] as const,
  body: (id: number) => [...publicCmsKeys.all, id, 'body'] as const,
};

/**
 * Hook to fetch paginated PUBLISHED CMS items (no auth required)
 */
export const usePublicCmsList = (params?: PublicCmsQueryParams) => {
  return useQuery({
    queryKey: publicCmsKeys.list(params),
    queryFn: () => publicCmsService.getAll(params),
  });
};

/**
 * Hook to fetch a single PUBLISHED CMS item by ID (no auth required)
 */
export const usePublicCmsById = (id: number, enabled = true) => {
  return useQuery({
    queryKey: publicCmsKeys.detail(id),
    queryFn: () => publicCmsService.getById(id),
    enabled: enabled && id > 0,
  });
};

/**
 * Hook to fetch body HTML content for a published CMS item
 */
export const usePublicCmsBody = (id: number, enabled = true) => {
  return useQuery({
    queryKey: publicCmsKeys.body(id),
    queryFn: () => publicCmsService.getBody(id),
    enabled: enabled && id > 0,
  });
};
