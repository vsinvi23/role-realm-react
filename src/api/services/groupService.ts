import apiClient from '../client';
import { ApiResponse, GroupResponseDto, GroupPagedResponse } from '../types';

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
};

export default groupService;
