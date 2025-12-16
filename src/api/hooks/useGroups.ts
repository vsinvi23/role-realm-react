import { useState, useCallback } from 'react';
import { groupService } from '../services/groupService';
import { groupRoleService } from '../services/groupRoleService';
import { userGroupService } from '../services/userGroupService';
import { GroupResponse, GroupRequest } from '../types';
import { AxiosError } from 'axios';

interface UseGroupsReturn {
  groups: GroupResponse[];
  isLoading: boolean;
  error: string | null;
  fetchGroups: () => Promise<void>;
  getGroup: (groupId: string) => Promise<GroupResponse | null>;
  createGroup: (data: GroupRequest) => Promise<GroupResponse | null>;
  updateGroup: (groupId: string, data: GroupRequest) => Promise<GroupResponse | null>;
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

export const useGroups = (): UseGroupsReturn => {
  const [groups, setGroups] = useState<GroupResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await groupService.getGroups();
      setGroups(data);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Failed to fetch groups');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getGroup = useCallback(async (groupId: string): Promise<GroupResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      return await groupService.getGroup(groupId);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Failed to fetch group');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createGroup = useCallback(async (data: GroupRequest): Promise<GroupResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const newGroup = await groupService.createGroup(data);
      setGroups((prev) => [...prev, newGroup]);
      return newGroup;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Failed to create group');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateGroup = useCallback(
    async (groupId: string, data: GroupRequest): Promise<GroupResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedGroup = await groupService.updateGroup(groupId, data);
        setGroups((prev) =>
          prev.map((group) => (group.id === groupId ? updatedGroup : group))
        );
        return updatedGroup;
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(axiosError.response?.data?.message || 'Failed to update group');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteGroup = useCallback(async (groupId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await groupService.deleteGroup(groupId);
      setGroups((prev) => prev.filter((group) => group.id !== groupId));
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Failed to delete group');
      return false;
    } finally {
      setIsLoading(false);
    }
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

export default useGroups;
