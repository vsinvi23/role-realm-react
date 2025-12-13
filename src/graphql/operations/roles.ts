import { gql } from '@apollo/client';
import { ROLE_FRAGMENT, USER_GROUP_FRAGMENT, PERMISSION_FRAGMENT, USER_BASIC_FRAGMENT, PAGE_INFO_FRAGMENT } from '../fragments';

// ============================================
// QUERIES
// ============================================

export const GET_ROLE_QUERY = gql`
  query GetRole($id: ID!) {
    role(id: $id) {
      ...RoleFields
      users {
        ...UserBasic
      }
      userGroups {
        id
        name
        memberCount
      }
    }
  }
  ${ROLE_FRAGMENT}
  ${USER_BASIC_FRAGMENT}
`;

export const GET_ROLES_QUERY = gql`
  query GetRoles {
    roles {
      ...RoleFields
    }
  }
  ${ROLE_FRAGMENT}
`;

export const GET_DEFAULT_ROLES_QUERY = gql`
  query GetDefaultRoles {
    defaultRoles {
      ...RoleFields
    }
  }
  ${ROLE_FRAGMENT}
`;

export const GET_CUSTOM_ROLES_QUERY = gql`
  query GetCustomRoles {
    customRoles {
      ...RoleFields
    }
  }
  ${ROLE_FRAGMENT}
`;

export const GET_PERMISSION_MATRIX_QUERY = gql`
  query GetPermissionMatrix {
    permissionMatrix {
      ...PermissionFields
    }
  }
  ${PERMISSION_FRAGMENT}
`;

export const GET_USER_GROUP_QUERY = gql`
  query GetUserGroup($id: ID!) {
    userGroup(id: $id) {
      ...UserGroupFields
      members {
        ...UserBasic
      }
    }
  }
  ${USER_GROUP_FRAGMENT}
  ${USER_BASIC_FRAGMENT}
`;

export const GET_USER_GROUPS_QUERY = gql`
  query GetUserGroups($pagination: PaginationInput) {
    userGroups(pagination: $pagination) {
      edges {
        node {
          ...UserGroupFields
        }
        cursor
      }
      pageInfo {
        ...PageInfoFields
      }
      totalCount
    }
  }
  ${USER_GROUP_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

export const GET_USER_GROUPS_BY_ROLE_QUERY = gql`
  query GetUserGroupsByRole($roleId: ID!) {
    userGroupsByRole(roleId: $roleId) {
      ...UserGroupFields
    }
  }
  ${USER_GROUP_FRAGMENT}
`;

// ============================================
// MUTATIONS
// ============================================

export const CREATE_ROLE_MUTATION = gql`
  mutation CreateRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      ...RoleFields
    }
  }
  ${ROLE_FRAGMENT}
`;

export const UPDATE_ROLE_MUTATION = gql`
  mutation UpdateRole($id: ID!, $input: UpdateRoleInput!) {
    updateRole(id: $id, input: $input) {
      ...RoleFields
    }
  }
  ${ROLE_FRAGMENT}
`;

export const DELETE_ROLE_MUTATION = gql`
  mutation DeleteRole($id: ID!) {
    deleteRole(id: $id) {
      success
      message
    }
  }
`;

export const DUPLICATE_ROLE_MUTATION = gql`
  mutation DuplicateRole($id: ID!, $name: String!) {
    duplicateRole(id: $id, name: $name) {
      ...RoleFields
    }
  }
  ${ROLE_FRAGMENT}
`;

export const CREATE_USER_GROUP_MUTATION = gql`
  mutation CreateUserGroup($input: CreateUserGroupInput!) {
    createUserGroup(input: $input) {
      ...UserGroupFields
    }
  }
  ${USER_GROUP_FRAGMENT}
`;

export const UPDATE_USER_GROUP_MUTATION = gql`
  mutation UpdateUserGroup($id: ID!, $input: UpdateUserGroupInput!) {
    updateUserGroup(id: $id, input: $input) {
      ...UserGroupFields
    }
  }
  ${USER_GROUP_FRAGMENT}
`;

export const DELETE_USER_GROUP_MUTATION = gql`
  mutation DeleteUserGroup($id: ID!) {
    deleteUserGroup(id: $id) {
      success
      message
    }
  }
`;

export const ADD_GROUP_MEMBERS_MUTATION = gql`
  mutation AddGroupMembers($input: ManageGroupMembersInput!) {
    addGroupMembers(input: $input) {
      ...UserGroupFields
      members {
        ...UserBasic
      }
    }
  }
  ${USER_GROUP_FRAGMENT}
  ${USER_BASIC_FRAGMENT}
`;

export const REMOVE_GROUP_MEMBERS_MUTATION = gql`
  mutation RemoveGroupMembers($input: ManageGroupMembersInput!) {
    removeGroupMembers(input: $input) {
      ...UserGroupFields
      members {
        ...UserBasic
      }
    }
  }
  ${USER_GROUP_FRAGMENT}
  ${USER_BASIC_FRAGMENT}
`;

export const ASSIGN_USER_GROUPS_TO_CATEGORY_MUTATION = gql`
  mutation AssignUserGroupsToCategory($categoryId: ID!, $userGroupIds: [ID!]!) {
    assignUserGroupsToCategory(categoryId: $categoryId, userGroupIds: $userGroupIds) {
      id
      name
      userGroups {
        id
        name
      }
    }
  }
`;
