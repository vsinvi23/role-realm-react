import apiClient from '../client';

const USER_GROUPS_BASE = '/api/user-groups';

export const userGroupService = {
  /**
   * Add a user to a group
   */
  addUserToGroup: async (userId: string, groupId: string): Promise<void> => {
    await apiClient.post(`${USER_GROUPS_BASE}/users/${userId}/groups/${groupId}`);
  },

  /**
   * Remove a user from a group
   */
  removeUserFromGroup: async (userId: string, groupId: string): Promise<void> => {
    await apiClient.delete(`${USER_GROUPS_BASE}/users/${userId}/groups/${groupId}`);
  },

  /**
   * Get all group IDs for a user
   */
  getGroupsByUser: async (userId: string): Promise<string[]> => {
    const response = await apiClient.get<string[]>(
      `${USER_GROUPS_BASE}/users/${userId}/groups`
    );
    return response.data;
  },

  /**
   * Get all user IDs for a group
   */
  getUsersByGroup: async (groupId: string): Promise<string[]> => {
    const response = await apiClient.get<string[]>(
      `${USER_GROUPS_BASE}/groups/${groupId}/users`
    );
    return response.data;
  },
};

export default userGroupService;
