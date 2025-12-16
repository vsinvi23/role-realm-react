import apiClient from '../client';
import { GroupRequest, GroupResponse } from '../types';

const GROUPS_BASE = '/api/groups';

export const groupService = {
  /**
   * Get all groups
   */
  getGroups: async (): Promise<GroupResponse[]> => {
    const response = await apiClient.get<GroupResponse[]>(GROUPS_BASE);
    return response.data;
  },

  /**
   * Get a single group by ID
   */
  getGroup: async (groupId: string): Promise<GroupResponse> => {
    const response = await apiClient.get<GroupResponse>(`${GROUPS_BASE}/${groupId}`);
    return response.data;
  },

  /**
   * Create a new group
   */
  createGroup: async (data: GroupRequest): Promise<GroupResponse> => {
    const response = await apiClient.post<GroupResponse>(GROUPS_BASE, data);
    return response.data;
  },

  /**
   * Update an existing group
   */
  updateGroup: async (groupId: string, data: GroupRequest): Promise<GroupResponse> => {
    const response = await apiClient.put<GroupResponse>(`${GROUPS_BASE}/${groupId}`, data);
    return response.data;
  },

  /**
   * Delete a group
   */
  deleteGroup: async (groupId: string): Promise<void> => {
    await apiClient.delete(`${GROUPS_BASE}/${groupId}`);
  },
};

export default groupService;
