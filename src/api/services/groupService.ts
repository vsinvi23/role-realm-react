import apiClient from '../client';
import { ApiResponse, GroupResponseDto, GroupPagedResponse, GroupRequest } from '../types';

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
    return response.data.data || { items: [], total: 0, currentPage: 0, pageSize: 10 };
  },

  /**
   * Get a single group by ID
   * GET /api/groups/:id
   */
  getGroup: async (groupId: number): Promise<GroupResponseDto> => {
    const response = await apiClient.get<ApiResponse<GroupResponseDto>>(`${GROUPS_BASE}/${groupId}`);
    return response.data.data!;
  },

  /**
   * Create a new group
   * POST /api/groups
   */
  createGroup: async (data: GroupRequest): Promise<GroupResponseDto> => {
    const response = await apiClient.post<ApiResponse<GroupResponseDto>>(GROUPS_BASE, data);
    return response.data.data!;
  },

  /**
   * Update an existing group
   * PUT /api/groups/:id
   */
  updateGroup: async (groupId: number, data: GroupRequest): Promise<GroupResponseDto> => {
    const response = await apiClient.put<ApiResponse<GroupResponseDto>>(`${GROUPS_BASE}/${groupId}`, data);
    return response.data.data!;
  },

  /**
   * Delete a group
   * DELETE /api/groups/:id
   */
  deleteGroup: async (groupId: number): Promise<void> => {
    await apiClient.delete(`${GROUPS_BASE}/${groupId}`);
  },
};

export default groupService;
