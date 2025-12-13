import { gql } from '@apollo/client';
import { USER_FULL_FRAGMENT, USER_BASIC_FRAGMENT, PAGE_INFO_FRAGMENT, ROLE_FRAGMENT } from '../fragments';

// ============================================
// QUERIES
// ============================================

export const GET_USER_QUERY = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserFull
      coursesCreated {
        id
        title
        status
      }
      articlesCreated {
        id
        title
        status
      }
      tasksCount
    }
  }
  ${USER_FULL_FRAGMENT}
`;

export const GET_USERS_QUERY = gql`
  query GetUsers(
    $filter: UserFilterInput
    $sort: UserSortInput
    $pagination: PaginationInput
  ) {
    users(filter: $filter, sort: $sort, pagination: $pagination) {
      edges {
        node {
          ...UserFull
        }
        cursor
      }
      pageInfo {
        ...PageInfoFields
      }
      totalCount
    }
  }
  ${USER_FULL_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

export const GET_USER_STATS_QUERY = gql`
  query GetUserStats {
    userStats {
      total
      active
      deactivated
      invited
      byRole {
        role {
          id
          name
        }
        count
      }
      recentUsers {
        ...UserBasic
        createdAt
      }
    }
  }
  ${USER_BASIC_FRAGMENT}
`;

// ============================================
// MUTATIONS
// ============================================

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...UserFull
    }
  }
  ${USER_FULL_FRAGMENT}
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      ...UserFull
    }
  }
  ${USER_FULL_FRAGMENT}
`;

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      success
      message
    }
  }
`;

export const DELETE_USERS_MUTATION = gql`
  mutation DeleteUsers($ids: [ID!]!) {
    deleteUsers(ids: $ids) {
      successCount
      failedCount
      errors {
        id
        message
      }
    }
  }
`;

export const INVITE_USER_MUTATION = gql`
  mutation InviteUser($input: InviteUserInput!) {
    inviteUser(input: $input) {
      ...UserFull
    }
  }
  ${USER_FULL_FRAGMENT}
`;

export const RESEND_INVITATION_MUTATION = gql`
  mutation ResendInvitation($userId: ID!) {
    resendInvitation(userId: $userId) {
      success
      message
    }
  }
`;

export const ACTIVATE_USER_MUTATION = gql`
  mutation ActivateUser($id: ID!) {
    activateUser(id: $id) {
      ...UserFull
    }
  }
  ${USER_FULL_FRAGMENT}
`;

export const DEACTIVATE_USER_MUTATION = gql`
  mutation DeactivateUser($id: ID!) {
    deactivateUser(id: $id) {
      ...UserFull
    }
  }
  ${USER_FULL_FRAGMENT}
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateUserInput!) {
    updateProfile(input: $input) {
      ...UserFull
    }
  }
  ${USER_FULL_FRAGMENT}
`;

export const UPLOAD_AVATAR_MUTATION = gql`
  mutation UploadAvatar($file: Upload!) {
    uploadAvatar(file: $file) {
      ...UserFull
    }
  }
  ${USER_FULL_FRAGMENT}
`;
