import apiClient from '../client';
import { PermissionRequest, PermissionResponse } from '../types';

const PERMISSIONS_BASE = '/api/permissions';

export const permissionService = {
  /**
   * Get all permissions
   */
  getPermissions: async (): Promise<PermissionResponse[]> => {
    const response = await apiClient.get<PermissionResponse[]>(PERMISSIONS_BASE);
    return response.data;
  },

  /**
   * Get a single permission by ID
   */
  getPermission: async (permissionId: string): Promise<PermissionResponse> => {
    const response = await apiClient.get<PermissionResponse>(
      `${PERMISSIONS_BASE}/${permissionId}`
    );
    return response.data;
  },

  /**
   * Create a new permission
   */
  createPermission: async (data: PermissionRequest): Promise<PermissionResponse> => {
    const response = await apiClient.post<PermissionResponse>(PERMISSIONS_BASE, data);
    return response.data;
  },

  /**
   * Update an existing permission
   */
  updatePermission: async (
    permissionId: string,
    data: PermissionRequest
  ): Promise<PermissionResponse> => {
    const response = await apiClient.put<PermissionResponse>(
      `${PERMISSIONS_BASE}/${permissionId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a permission
   */
  deletePermission: async (permissionId: string): Promise<void> => {
    await apiClient.delete(`${PERMISSIONS_BASE}/${permissionId}`);
  },
};

export default permissionService;
