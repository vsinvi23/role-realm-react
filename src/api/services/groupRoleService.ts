import apiClient from '../client';

const GROUP_ROLES_BASE = '/api/group-roles';

export const groupRoleService = {
  /**
   * Assign a role to a group
   */
  assignRoleToGroup: async (groupId: string, roleId: string): Promise<void> => {
    await apiClient.post(`${GROUP_ROLES_BASE}/groups/${groupId}/roles/${roleId}`);
  },

  /**
   * Remove a role from a group
   */
  removeRoleFromGroup: async (groupId: string, roleId: string): Promise<void> => {
    await apiClient.delete(`${GROUP_ROLES_BASE}/groups/${groupId}/roles/${roleId}`);
  },

  /**
   * Get all role IDs for a group
   */
  getRolesByGroup: async (groupId: string): Promise<string[]> => {
    const response = await apiClient.get<string[]>(
      `${GROUP_ROLES_BASE}/groups/${groupId}/roles`
    );
    return response.data;
  },

  /**
   * Get all group IDs for a role
   */
  getGroupsByRole: async (roleId: string): Promise<string[]> => {
    const response = await apiClient.get<string[]>(
      `${GROUP_ROLES_BASE}/roles/${roleId}/groups`
    );
    return response.data;
  },
};

export default groupRoleService;
