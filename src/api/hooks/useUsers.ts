import { useState, useCallback } from 'react';
import { userService } from '../services/userService';
import { UserResponse, UserRequest, UserDto } from '../types';
import { AxiosError } from 'axios';

// Helper to map UserDto to UserResponse for backwards compatibility
function mapUserDtoToResponse(dto: UserDto): UserResponse {
  return {
    id: String(dto.id),
    name: dto.name,
    email: dto.email,
    status: dto.status as UserResponse['status'],
    lastLogin: dto.lastLogin,
    createdAt: dto.createdAt,
    mobileNo: dto.mobileNo,
    groups: dto.groups,
  };
}

interface UseUsersReturn {
  users: UserResponse[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  fetchUsers: (params?: { page?: number; size?: number }) => Promise<void>;
  getUser: (userId: string) => Promise<UserResponse | null>;
  createUser: (data: UserRequest) => Promise<UserResponse | null>;
  updateUser: (userId: string, data: UserRequest) => Promise<UserResponse | null>;
  deleteUser: (userId: string) => Promise<boolean>;
  clearError: () => void;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Note: User list endpoint not available in current API - returns empty
  const fetchUsers = useCallback(async (params?: { page?: number; size?: number }) => {
    setIsLoading(true);
    setError(null);
    try {
      // User list endpoint not in current API spec
      setUsers([]);
      setTotalElements(0);
      setTotalPages(0);
      setCurrentPage(params?.page ?? 0);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUser = useCallback(async (userId: string): Promise<UserResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const dto = await userService.getUser(parseInt(userId));
      return mapUserDtoToResponse(dto);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Failed to fetch user');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Stub - not available in current API
  const createUser = useCallback(async (data: UserRequest): Promise<UserResponse | null> => {
    setError('Create user operation not available in current API');
    return null;
  }, []);

  // Stub - not available in current API
  const updateUser = useCallback(
    async (userId: string, data: UserRequest): Promise<UserResponse | null> => {
      setError('Update user operation not available in current API');
      return null;
    },
    []
  );

  // Stub - not available in current API
  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    setError('Delete user operation not available in current API');
    return false;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    users,
    totalElements,
    totalPages,
    currentPage,
    isLoading,
    error,
    fetchUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    clearError,
  };
};

export default useUsers;
