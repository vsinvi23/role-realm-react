import apiClient from '../client';
import {
  ApiResponse,
  UserDto,
  UserRequest,
  UserResponse,
  PagedResponse,
  PageResponse,
  UserQueryParams,
} from '../types';

const USERS_BASE = '/api/users';

export const userService = {
  /**
   * Get paginated list of users with optional filters
   * GET /api/users
   */
  getUsers: async (params?: UserQueryParams): Promise<PageResponse<UserResponse>> => {
    const response = await apiClient.get<ApiResponse<PagedResponse<UserDto>>>(USERS_BASE, {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
        status: params?.status,
        search: params?.search,
      },
    });
    
    // Transform PagedResponse to PageResponse for backwards compatibility
    const data = response.data.data;
    if (data) {
      return {
        content: data.items.map(mapUserDtoToResponse),
        page: data.page,
        size: data.size,
        totalElements: data.total,
        totalPages: Math.ceil(data.total / data.size),
        last: (data.page + 1) * data.size >= data.total,
      };
    }
    
    return {
      content: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      last: true,
    };
  },

  /**
   * Get a single user by ID
   * GET /api/users/:id
   */
  getUser: async (userId: string | number): Promise<UserResponse> => {
    const response = await apiClient.get<ApiResponse<UserDto>>(`${USERS_BASE}/${userId}`);
    return mapUserDtoToResponse(response.data.data!);
  },

  /**
   * Create a new user
   * POST /api/users
   */
  createUser: async (data: UserRequest): Promise<UserResponse> => {
    const response = await apiClient.post<ApiResponse<UserDto>>(USERS_BASE, data);
    return mapUserDtoToResponse(response.data.data!);
  },

  /**
   * Update an existing user
   * PUT /api/users/:id
   */
  updateUser: async (userId: string | number, data: UserRequest): Promise<UserResponse> => {
    const response = await apiClient.put<ApiResponse<UserDto>>(`${USERS_BASE}/${userId}`, data);
    return mapUserDtoToResponse(response.data.data!);
  },

  /**
   * Delete a user
   * DELETE /api/users/:id
   */
  deleteUser: async (userId: string | number): Promise<void> => {
    await apiClient.delete(`${USERS_BASE}/${userId}`);
  },
};

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

export default userService;
