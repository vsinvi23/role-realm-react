import apiClient from '../client';
import { RoleRequest, RoleResponse } from '../types';

const ROLES_BASE = '/api/roles';

export const roleService = {
  /**
   * Get all roles
   */
  getRoles: async (): Promise<RoleResponse[]> => {
    const response = await apiClient.get<RoleResponse[]>(ROLES_BASE);
    return response.data;
  },

  /**
   * Get a single role by ID
   */
  getRole: async (roleId: string): Promise<RoleResponse> => {
    const response = await apiClient.get<RoleResponse>(`${ROLES_BASE}/${roleId}`);
    return response.data;
  },

  /**
   * Create a new role
   */
  createRole: async (data: RoleRequest): Promise<RoleResponse> => {
    const response = await apiClient.post<RoleResponse>(ROLES_BASE, data);
    return response.data;
  },

  /**
   * Update an existing role
   */
  updateRole: async (roleId: string, data: RoleRequest): Promise<RoleResponse> => {
    const response = await apiClient.put<RoleResponse>(`${ROLES_BASE}/${roleId}`, data);
    return response.data;
  },

  /**
   * Delete a role
   */
  deleteRole: async (roleId: string): Promise<void> => {
    await apiClient.delete(`${ROLES_BASE}/${roleId}`);
  },
};

export default roleService;
