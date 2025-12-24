import apiClient from '../client';
import {
  ApiResponse,
  CmsCreateDto,
  CmsResponseDto,
  CmsSubmitRequest,
  CmsPublishRequest,
  CmsSendBackRequest,
  StoredFileInfo,
} from '../types';

const CMS_BASE = '/api/cms';

export const cmsService = {
  /**
   * Create a new CMS record
   * POST /api/cms
   */
  create: async (data: CmsCreateDto): Promise<CmsResponseDto> => {
    const response = await apiClient.post<ApiResponse<CmsResponseDto>>(CMS_BASE, data);
    return response.data.data!;
  },

  /**
   * Get CMS record by ID
   * GET /api/cms/:id
   */
  getById: async (id: number): Promise<CmsResponseDto> => {
    const response = await apiClient.get<ApiResponse<CmsResponseDto>>(`${CMS_BASE}/${id}`);
    return response.data.data!;
  },

  /**
   * Upload content file for a CMS item
   * POST /api/cms/:id/upload
   */
  uploadContent: async (id: number, file: File): Promise<StoredFileInfo> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<StoredFileInfo>>(
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
   * @returns Blob of the file content
   */
  downloadContent: async (id: number): Promise<Blob> => {
    const response = await apiClient.get<Blob>(`${CMS_BASE}/${id}/content`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Submit CMS for review
   * POST /api/cms/:id/submit
   */
  submitForReview: async (id: number, data: CmsSubmitRequest): Promise<CmsResponseDto> => {
    const response = await apiClient.post<ApiResponse<CmsResponseDto>>(
      `${CMS_BASE}/${id}/submit`,
      data
    );
    return response.data.data!;
  },

  /**
   * Publish CMS content
   * POST /api/cms/:id/publish
   */
  publish: async (id: number, data: CmsPublishRequest): Promise<CmsResponseDto> => {
    const response = await apiClient.post<ApiResponse<CmsResponseDto>>(
      `${CMS_BASE}/${id}/publish`,
      data
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
