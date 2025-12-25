import apiClient from '../client';
import { ApiResponse, GroupCreateDto, GroupResponseDto, GroupPagedResponse, GroupUserDto } from '../types';

const GROUPS_BASE = '/api/groups';

export interface GroupQueryParams {
  page?: number;
  size?: number;
}

export interface AddMemberRequest {
  userId: number;
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
    return response.data.data || { items: [], totalElements: 0, currentPage: 0, pageSize: 10 };
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
   * Update a group (admin only)
   * PUT /api/groups/:id
   */
  updateGroup: async (id: number, data: GroupCreateDto): Promise<GroupResponseDto> => {
    const response = await apiClient.put<ApiResponse<GroupResponseDto>>(`${GROUPS_BASE}/${id}`, data);
    return response.data.data!;
  },

  /**
   * Delete a group (admin only)
   * DELETE /api/groups/:id
   */
  deleteGroup: async (id: number): Promise<void> => {
    await apiClient.delete(`${GROUPS_BASE}/${id}`);
  },

  /**
   * Get members of a group
   * GET /api/groups/:id/members
   */
  getGroupMembers: async (groupId: number): Promise<GroupUserDto[]> => {
    const response = await apiClient.get<ApiResponse<GroupUserDto[]>>(`${GROUPS_BASE}/${groupId}/members`);
    return response.data.data || [];
  },

  /**
   * Add a member to a group (admin only)
   * POST /api/groups/:id/members
   */
  addGroupMember: async (groupId: number, userId: number): Promise<void> => {
    await apiClient.post<ApiResponse<null>>(`${GROUPS_BASE}/${groupId}/members`, { userId });
  },

  /**
   * Remove a member from a group (admin only)
   * DELETE /api/groups/:id/members/:userId
   */
  removeGroupMember: async (groupId: number, userId: number): Promise<void> => {
    await apiClient.delete(`${GROUPS_BASE}/${groupId}/members/${userId}`);
  },
};

export default groupService;
