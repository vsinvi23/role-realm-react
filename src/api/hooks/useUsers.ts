import { useState, useCallback } from 'react';
import { userService } from '../services/userService';
import { UserResponse, UserRequest, PageResponse, UserQueryParams } from '../types';
import { AxiosError } from 'axios';

interface UseUsersReturn {
  users: UserResponse[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  fetchUsers: (params?: UserQueryParams) => Promise<void>;
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

  const fetchUsers = useCallback(async (params?: UserQueryParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userService.getUsers(params);
      setUsers(response.content);
      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
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
      return await userService.getUser(userId);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Failed to fetch user');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = useCallback(async (data: UserRequest): Promise<UserResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const newUser = await userService.createUser(data);
      setUsers((prev) => [...prev, newUser]);
      return newUser;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Failed to create user');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(
    async (userId: string, data: UserRequest): Promise<UserResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedUser = await userService.updateUser(userId, data);
        setUsers((prev) =>
          prev.map((user) => (user.id === userId ? updatedUser : user))
        );
        return updatedUser;
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(axiosError.response?.data?.message || 'Failed to update user');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await userService.deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Failed to delete user');
      return false;
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
    createUser,
    updateUser,
    deleteUser,
    clearError,
  };
};

export default useUsers;
