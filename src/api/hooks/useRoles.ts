import { useState, useCallback } from 'react';
import { roleService } from '../services/roleService';
import { rolePermissionService } from '../services/rolePermissionService';
import { RoleResponse, RoleRequest } from '../types';
import { AxiosError } from 'axios';

interface UseRolesReturn {
  roles: RoleResponse[];
  isLoading: boolean;
  error: string | null;
  fetchRoles: () => Promise<void>;
  getRole: (roleId: string) => Promise<RoleResponse | null>;
  createRole: (data: RoleRequest) => Promise<RoleResponse | null>;
  updateRole: (roleId: string, data: RoleRequest) => Promise<RoleResponse | null>;
  deleteRole: (roleId: string) => Promise<boolean>;
  getPermissionsByRole: (roleId: string) => Promise<string[]>;
  assignPermission: (roleId: string, permissionId: string) => Promise<boolean>;
  removePermission: (roleId: string, permissionId: string) => Promise<boolean>;
  clearError: () => void;
}

export const useRoles = (): UseRolesReturn => {
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await roleService.getRoles();
      setRoles(data);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Failed to fetch roles');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRole = useCallback(async (roleId: string): Promise<RoleResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      return await roleService.getRole(roleId);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Failed to fetch role');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRole = useCallback(async (data: RoleRequest): Promise<RoleResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const newRole = await roleService.createRole(data);
      setRoles((prev) => [...prev, newRole]);
      return newRole;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Failed to create role');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateRole = useCallback(
    async (roleId: string, data: RoleRequest): Promise<RoleResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedRole = await roleService.updateRole(roleId, data);
        setRoles((prev) =>
          prev.map((role) => (role.id === roleId ? updatedRole : role))
        );
        return updatedRole;
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(axiosError.response?.data?.message || 'Failed to update role');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteRole = useCallback(async (roleId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await roleService.deleteRole(roleId);
      setRoles((prev) => prev.filter((role) => role.id !== roleId));
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Failed to delete role');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPermissionsByRole = useCallback(async (roleId: string): Promise<string[]> => {
    try {
      return await rolePermissionService.getPermissionsByRole(roleId);
    } catch {
      return [];
    }
  }, []);

  const assignPermission = useCallback(
    async (roleId: string, permissionId: string): Promise<boolean> => {
      try {
        await rolePermissionService.assignPermissionToRole(roleId, permissionId);
        return true;
      } catch {
        return false;
      }
    },
    []
  );

  const removePermission = useCallback(
    async (roleId: string, permissionId: string): Promise<boolean> => {
      try {
        await rolePermissionService.removePermissionFromRole(roleId, permissionId);
        return true;
      } catch {
        return false;
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    roles,
    isLoading,
    error,
    fetchRoles,
    getRole,
    createRole,
    updateRole,
    deleteRole,
    getPermissionsByRole,
    assignPermission,
    removePermission,
    clearError,
  };
};

export default useRoles;
