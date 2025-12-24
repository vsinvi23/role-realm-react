import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { groupService, GroupQueryParams } from '../services/groupService';
import { groupRoleService } from '../services/groupRoleService';
import { userGroupService } from '../services/userGroupService';
import { GroupRequest, GroupResponseDto } from '../types';
import { AxiosError } from 'axios';

// Query keys
export const groupKeys = {
  all: ['groups'] as const,
  list: (params?: GroupQueryParams) => [...groupKeys.all, 'list', params] as const,
  detail: (id: number) => [...groupKeys.all, 'detail', id] as const,
};

/**
 * Hook to fetch paginated groups (React Query)
 */
export const useGroupsQuery = (params?: GroupQueryParams) => {
  return useQuery({
    queryKey: groupKeys.list(params),
    queryFn: () => groupService.getGroups(params),
  });
};

/**
 * Hook to fetch a single group by ID
 */
export const useGroup = (id: number, enabled = true) => {
  return useQuery({
    queryKey: groupKeys.detail(id),
    queryFn: () => groupService.getGroup(id),
    enabled: enabled && id > 0,
  });
};

// Legacy compatibility interface
interface LegacyGroupResponse {
  id: string;
  name: string;
  description: string | null;
  members?: Array<{ id: string; name: string; email: string; createdAt: string }>;
}

interface UseGroupsReturn {
  groups: LegacyGroupResponse[];
  isLoading: boolean;
  error: string | null;
  fetchGroups: () => Promise<void>;
  getGroup: (groupId: string) => Promise<LegacyGroupResponse | null>;
  createGroup: (data: GroupRequest) => Promise<LegacyGroupResponse | null>;
  updateGroup: (groupId: string, data: GroupRequest) => Promise<LegacyGroupResponse | null>;
  deleteGroup: (groupId: string) => Promise<boolean>;
  // Role-Group mappings
  getRolesByGroup: (groupId: string) => Promise<string[]>;
  assignRoleToGroup: (groupId: string, roleId: string) => Promise<boolean>;
  removeRoleFromGroup: (groupId: string, roleId: string) => Promise<boolean>;
  // User-Group memberships
  getUsersByGroup: (groupId: string) => Promise<string[]>;
  getGroupsByUser: (userId: string) => Promise<string[]>;
  addUserToGroup: (userId: string, groupId: string) => Promise<boolean>;
  removeUserFromGroup: (userId: string, groupId: string) => Promise<boolean>;
  clearError: () => void;
}

// Convert new DTO to legacy format
const mapToLegacy = (dto: GroupResponseDto): LegacyGroupResponse => ({
  id: String(dto.id),
  name: dto.name,
  description: null,
  members: dto.users?.map(u => ({
    id: String(u.id),
    name: u.name,
    email: u.email,
    createdAt: new Date().toISOString(),
  })) || [],
});

/**
 * Legacy hook for backward compatibility with Roles.tsx
 * Note: Create, Update, Delete operations are not available in current API
 */
export const useGroups = (): UseGroupsReturn => {
  const [groups, setGroups] = useState<LegacyGroupResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await groupService.getGroups();
      setGroups(data.items.map(mapToLegacy));
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Failed to fetch groups');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getGroup = useCallback(async (groupId: string): Promise<LegacyGroupResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await groupService.getGroup(parseInt(groupId));
      return mapToLegacy(result);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Failed to fetch group');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Stub implementations for operations not in current API
  const createGroup = useCallback(async (data: GroupRequest): Promise<LegacyGroupResponse | null> => {
    setError('Create group operation not available in current API');
    return null;
  }, []);

  const updateGroup = useCallback(
    async (groupId: string, data: GroupRequest): Promise<LegacyGroupResponse | null> => {
      setError('Update group operation not available in current API');
      return null;
    },
    []
  );

  const deleteGroup = useCallback(async (groupId: string): Promise<boolean> => {
    setError('Delete group operation not available in current API');
    return false;
  }, []);

  // Role-Group mappings
  const getRolesByGroup = useCallback(async (groupId: string): Promise<string[]> => {
    try {
      return await groupRoleService.getRolesByGroup(groupId);
    } catch {
      return [];
    }
  }, []);

  const assignRoleToGroup = useCallback(
    async (groupId: string, roleId: string): Promise<boolean> => {
      try {
        await groupRoleService.assignRoleToGroup(groupId, roleId);
        return true;
      } catch {
        return false;
      }
    },
    []
  );

  const removeRoleFromGroup = useCallback(
    async (groupId: string, roleId: string): Promise<boolean> => {
      try {
        await groupRoleService.removeRoleFromGroup(groupId, roleId);
        return true;
      } catch {
        return false;
      }
    },
    []
  );

  // User-Group memberships
  const getUsersByGroup = useCallback(async (groupId: string): Promise<string[]> => {
    try {
      return await userGroupService.getUsersByGroup(groupId);
    } catch {
      return [];
    }
  }, []);

  const getGroupsByUser = useCallback(async (userId: string): Promise<string[]> => {
    try {
      return await userGroupService.getGroupsByUser(userId);
    } catch {
      return [];
    }
  }, []);

  const addUserToGroup = useCallback(
    async (userId: string, groupId: string): Promise<boolean> => {
      try {
        await userGroupService.addUserToGroup(userId, groupId);
        return true;
      } catch {
        return false;
      }
    },
    []
  );

  const removeUserFromGroup = useCallback(
    async (userId: string, groupId: string): Promise<boolean> => {
      try {
        await userGroupService.removeUserFromGroup(userId, groupId);
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
    groups,
    isLoading,
    error,
    fetchGroups,
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    getRolesByGroup,
    assignRoleToGroup,
    removeRoleFromGroup,
    getUsersByGroup,
    getGroupsByUser,
    addUserToGroup,
    removeUserFromGroup,
    clearError,
  };
};

// Export stubs for backward compatibility
export const useCreateGroup = () => ({ mutate: () => {}, mutateAsync: async () => null, isPending: false });
export const useUpdateGroup = () => ({ mutate: () => {}, mutateAsync: async () => null, isPending: false });
export const useDeleteGroup = () => ({ mutate: () => {}, mutateAsync: async () => {}, isPending: false });

export default useGroups;
