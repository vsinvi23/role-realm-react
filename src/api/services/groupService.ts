import apiClient from '../client';
import { ApiResponse, GroupCreateDto, GroupResponseDto, GroupPagedResponse } from '../types';

const GROUPS_BASE = '/api/groups';

export interface GroupQueryParams {
  page?: number;
  size?: number;
}

export const groupService = {
  /**
   * Get paginated list of groups
   * GET /api/groups?page=0&size=10
   */
  getGroups: async (params?: GroupQueryParams): Promise<GroupPagedResponse> => {
    const response = await apiClient.get<ApiResponse<GroupPagedResponse>>(GROUPS_BASE, {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
      },
    });
    return response.data.data || { items: [], totalElements: 0, page: 0, size: 10 };
  },

  /**
   * Get a single group by ID
   * GET /api/groups/:id
   */
  getGroup: async (id: number): Promise<GroupResponseDto> => {
    const response = await apiClient.get<ApiResponse<GroupResponseDto>>(`${GROUPS_BASE}/${id}`);
    return response.data.data!;
  },

  /**
   * Create a new group (admin only)
   * POST /api/groups
   */
  createGroup: async (data: GroupCreateDto): Promise<GroupResponseDto> => {
    const response = await apiClient.post<ApiResponse<GroupResponseDto>>(GROUPS_BASE, data);
    return response.data.data!;
  },

  /**
   * Delete a group (admin only)
   * DELETE /api/groups/:id
   */
  deleteGroup: async (id: number): Promise<void> => {
    await apiClient.delete(`${GROUPS_BASE}/${id}`);
  },
};

export default groupService;
