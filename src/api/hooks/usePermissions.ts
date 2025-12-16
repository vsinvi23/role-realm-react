import { useState, useCallback } from 'react';
import { permissionService } from '../services/permissionService';
import { PermissionResponse, PermissionRequest } from '../types';
import { AxiosError } from 'axios';

interface UsePermissionsReturn {
  permissions: PermissionResponse[];
  isLoading: boolean;
  error: string | null;
  fetchPermissions: () => Promise<void>;
  getPermission: (permissionId: string) => Promise<PermissionResponse | null>;
  createPermission: (data: PermissionRequest) => Promise<PermissionResponse | null>;
  updatePermission: (
    permissionId: string,
    data: PermissionRequest
  ) => Promise<PermissionResponse | null>;
  deletePermission: (permissionId: string) => Promise<boolean>;
  clearError: () => void;
}

export const usePermissions = (): UsePermissionsReturn => {
  const [permissions, setPermissions] = useState<PermissionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await permissionService.getPermissions();
      setPermissions(data);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Failed to fetch permissions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPermission = useCallback(
    async (permissionId: string): Promise<PermissionResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        return await permissionService.getPermission(permissionId);
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(axiosError.response?.data?.message || 'Failed to fetch permission');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const createPermission = useCallback(
    async (data: PermissionRequest): Promise<PermissionResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const newPermission = await permissionService.createPermission(data);
        setPermissions((prev) => [...prev, newPermission]);
        return newPermission;
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(axiosError.response?.data?.message || 'Failed to create permission');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updatePermission = useCallback(
    async (
      permissionId: string,
      data: PermissionRequest
    ): Promise<PermissionResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedPermission = await permissionService.updatePermission(
          permissionId,
          data
        );
        setPermissions((prev) =>
          prev.map((perm) => (perm.id === permissionId ? updatedPermission : perm))
        );
        return updatedPermission;
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(axiosError.response?.data?.message || 'Failed to update permission');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deletePermission = useCallback(async (permissionId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await permissionService.deletePermission(permissionId);
      setPermissions((prev) => prev.filter((perm) => perm.id !== permissionId));
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Failed to delete permission');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    permissions,
    isLoading,
    error,
    fetchPermissions,
    getPermission,
    createPermission,
    updatePermission,
    deletePermission,
    clearError,
  };
};

export default usePermissions;
