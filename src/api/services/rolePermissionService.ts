import apiClient from '../client';

const ROLE_PERMISSIONS_BASE = '/api/role-permissions';

export const rolePermissionService = {
  /**
   * Assign a permission to a role
   */
  assignPermissionToRole: async (roleId: string, permissionId: string): Promise<void> => {
    await apiClient.post(
      `${ROLE_PERMISSIONS_BASE}/roles/${roleId}/permissions/${permissionId}`
    );
  },

  /**
   * Remove a permission from a role
   */
  removePermissionFromRole: async (roleId: string, permissionId: string): Promise<void> => {
    await apiClient.delete(
      `${ROLE_PERMISSIONS_BASE}/roles/${roleId}/permissions/${permissionId}`
    );
  },

  /**
   * Get all permission IDs for a role
   */
  getPermissionsByRole: async (roleId: string): Promise<string[]> => {
    const response = await apiClient.get<string[]>(
      `${ROLE_PERMISSIONS_BASE}/roles/${roleId}/permissions`
    );
    return response.data;
  },

  /**
   * Get all role IDs for a permission
   */
  getRolesByPermission: async (permissionId: string): Promise<string[]> => {
    const response = await apiClient.get<string[]>(
      `${ROLE_PERMISSIONS_BASE}/permissions/${permissionId}/roles`
    );
    return response.data;
  },
};

export default rolePermissionService;
