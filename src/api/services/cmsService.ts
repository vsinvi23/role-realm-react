import apiClient from '../client';
import {
  ApiResponse,
  CmsCreateDto,
  CmsUpdateDto,
  CmsResponseDto,
  CmsPagedResponse,
  CmsSubmitRequest,
  CmsPublishRequest,
  CmsSendBackRequest,
} from '../types';

const CMS_BASE = '/api/cms';

export interface CmsQueryParams {
  page?: number;
  size?: number;
}

export const cmsService = {
  /**
   * Get paginated list of CMS items
   * GET /api/cms?page=0&size=10
   */
  getAll: async (params?: CmsQueryParams): Promise<CmsPagedResponse> => {
    const response = await apiClient.get<ApiResponse<CmsPagedResponse>>(CMS_BASE, {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
      },
    });
    return response.data.data || { items: [], totalElements: 0, currentPage: 0, pageSize: 10 };
  },

  /**
   * Get CMS by ID
   * GET /api/cms/:id
   */
  getById: async (id: number): Promise<CmsResponseDto> => {
    const response = await apiClient.get<ApiResponse<CmsResponseDto>>(`${CMS_BASE}/${id}`);
    return response.data.data!;
  },

  /**
   * Create a new CMS record
   * POST /api/cms
   */
  create: async (data: CmsCreateDto): Promise<CmsResponseDto> => {
    const response = await apiClient.post<ApiResponse<CmsResponseDto>>(CMS_BASE, data);
    return response.data.data!;
  },

  /**
   * Update CMS metadata (title, description, categoryId, type)
   * PUT /api/cms/:id
   */
  update: async (id: number, data: CmsUpdateDto): Promise<CmsResponseDto> => {
    const response = await apiClient.put<ApiResponse<CmsResponseDto>>(`${CMS_BASE}/${id}`, data);
    return response.data.data!;
  },

  /**
   * Delete CMS item
   * DELETE /api/cms/:id
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${CMS_BASE}/${id}`);
  },

  /**
   * Upload content file for a CMS item
   * POST /api/cms/:id/upload
   */
  uploadContent: async (id: number, file: File): Promise<CmsResponseDto> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<CmsResponseDto>>(
      `${CMS_BASE}/${id}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data!;
  },

  /**
   * Download content for a CMS item
   * GET /api/cms/:id/content
   */
  downloadContent: async (id: number): Promise<Blob> => {
    const response = await apiClient.get<Blob>(`${CMS_BASE}/${id}/content`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Upload thumbnail for a CMS item
   * POST /api/cms/:id/thumbnail
   */
  uploadThumbnail: async (id: number, file: File): Promise<CmsResponseDto> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<CmsResponseDto>>(
      `${CMS_BASE}/${id}/thumbnail`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data!;
  },

  /**
   * Get thumbnail for a CMS item
   * GET /api/cms/:id/thumbnail
   */
  getThumbnail: async (id: number): Promise<Blob> => {
    const response = await apiClient.get<Blob>(`${CMS_BASE}/${id}/thumbnail`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Submit CMS for review
   * POST /api/cms/:id/submit
   */
  submitForReview: async (id: number, data?: CmsSubmitRequest): Promise<CmsResponseDto> => {
    const response = await apiClient.post<ApiResponse<CmsResponseDto>>(
      `${CMS_BASE}/${id}/submit`,
      data || {}
    );
    return response.data.data!;
  },

  /**
   * Publish CMS item (admin only)
   * POST /api/cms/:id/publish
   */
  publish: async (id: number, data?: CmsPublishRequest): Promise<CmsResponseDto> => {
    const response = await apiClient.post<ApiResponse<CmsResponseDto>>(
      `${CMS_BASE}/${id}/publish`,
      data || {}
    );
    return response.data.data!;
  },

  /**
   * Send CMS back to draft with reviewer comment
   * POST /api/cms/:id/send-back
   */
  sendBack: async (id: number, data: CmsSendBackRequest): Promise<CmsResponseDto> => {
    const response = await apiClient.post<ApiResponse<CmsResponseDto>>(
      `${CMS_BASE}/${id}/send-back`,
      data
    );
    return response.data.data!;
  },
};

export default cmsService;
