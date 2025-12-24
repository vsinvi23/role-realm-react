import { useState, useCallback } from 'react';
import { userService, UserQueryParams } from '../services/userService';
import { UserResponse, UserDto } from '../types';
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
  fetchUsers: (params?: UserQueryParams) => Promise<void>;
  getUser: (userId: string) => Promise<UserResponse | null>;
  clearError: () => void;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (params?: UserQueryParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers(params);
      setUsers(data.items.map(mapUserDtoToResponse));
      setTotalElements(data.totalElements);
      setTotalPages(Math.ceil(data.totalElements / (params?.size || 10)));
      setCurrentPage(data.page);
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
    clearError,
  };
};

export default useUsers;
