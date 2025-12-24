import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cmsService } from '../services';
import { CmsCreateDto, CmsSubmitRequest, CmsPublishRequest, CmsSendBackRequest } from '../types';

// Query keys
export const cmsKeys = {
  all: ['cms'] as const,
  detail: (id: number) => [...cmsKeys.all, id] as const,
};

/**
 * Hook to fetch a CMS item by ID
 */
export const useCmsItem = (id: number, enabled = true) => {
  return useQuery({
    queryKey: cmsKeys.detail(id),
    queryFn: () => cmsService.getById(id),
    enabled: enabled && id > 0,
  });
};

/**
 * Hook to create a new CMS item
 */
export const useCreateCms = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CmsCreateDto) => cmsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.all });
    },
  });
};

/**
 * Hook to upload content to a CMS item
 */
export const useUploadCmsContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => 
      cmsService.uploadContent(id, file),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.detail(id) });
    },
  });
};

/**
 * Hook to download CMS content
 */
export const useDownloadCmsContent = (id: number, enabled = false) => {
  return useQuery({
    queryKey: [...cmsKeys.detail(id), 'content'],
    queryFn: () => cmsService.downloadContent(id),
    enabled: enabled && id > 0,
  });
};

/**
 * Hook to submit CMS for review
 */
export const useSubmitCmsForReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CmsSubmitRequest }) => 
      cmsService.submitForReview(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.detail(id) });
    },
  });
};

/**
 * Hook to publish CMS content
 */
export const usePublishCms = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CmsPublishRequest }) => 
      cmsService.publish(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.detail(id) });
    },
  });
};

/**
 * Hook to send CMS back to draft
 */
export const useSendCmsBack = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CmsSendBackRequest }) => 
      cmsService.sendBack(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.detail(id) });
    },
  });
};
