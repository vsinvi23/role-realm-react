import axios from 'axios';
import { ApiResponse, CmsResponseDto } from '../types';

// Public API doesn't need authentication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const PUBLIC_CMS_BASE = '/public/cms';

// Create a separate axios instance for public endpoints (no auth needed)
const publicClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PublicCmsQueryParams {
  page?: number;
  size?: number;
  type?: 'ARTICLE' | 'COURSE' | 'VIDEO';
}

export interface PublicCmsPagedResponse {
  items: CmsResponseDto[];
  total: number;
  currentPage: number;
  pageSize: number;
}

export const publicCmsService = {
  /**
   * Get paginated list of PUBLISHED CMS items
   * GET /public/cms?page=0&size=10&type=ARTICLE|COURSE
   * No authentication required
   */
  getAll: async (params?: PublicCmsQueryParams): Promise<PublicCmsPagedResponse> => {
    const response = await publicClient.get<ApiResponse<PublicCmsPagedResponse>>(PUBLIC_CMS_BASE, {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
        type: params?.type,
      },
    });
    return response.data.data || { items: [], total: 0, currentPage: 0, pageSize: 10 };
  },

  /**
   * Get single PUBLISHED CMS item by ID
   * GET /public/cms/:id
   * No authentication required
   */
  getById: async (id: number): Promise<CmsResponseDto> => {
    const response = await publicClient.get<ApiResponse<CmsResponseDto>>(`${PUBLIC_CMS_BASE}/${id}`);
    return response.data.data!;
  },

  /**
   * Get body HTML content for a published CMS item
   * GET /public/cms/:id/body
   * Returns raw HTML string
   */
  getBody: async (id: number): Promise<string> => {
    const response = await publicClient.get<string>(`${PUBLIC_CMS_BASE}/${id}/body`, {
      responseType: 'text',
    });
    return response.data;
  },

  /**
   * Get full thumbnail URL (public endpoint)
   * GET /public/cms/:id/thumbnail
   */
  getThumbnailUrl: (id: number): string => {
    return `${API_BASE_URL}${PUBLIC_CMS_BASE}/${id}/thumbnail`;
  },

  /**
   * Download thumbnail as blob (for cases where direct URL doesn't work)
   */
  getThumbnail: async (id: number): Promise<Blob> => {
    const response = await publicClient.get<Blob>(`${PUBLIC_CMS_BASE}/${id}/thumbnail`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get attachment download URL
   * GET /public/cms/:id/attachments/:name
   */
  getAttachmentUrl: (id: number, name: string): string => {
    return `${API_BASE_URL}${PUBLIC_CMS_BASE}/${id}/attachments/${encodeURIComponent(name)}`;
  },
};

export default publicCmsService;
