import { gql } from '@apollo/client';
import { CATEGORY_BASIC_FRAGMENT, CATEGORY_FULL_FRAGMENT } from '../fragments';

// ============================================
// QUERIES
// ============================================

export const GET_CATEGORY_QUERY = gql`
  query GetCategory($id: ID, $slug: String) {
    category(id: $id, slug: $slug) {
      ...CategoryFull
      userGroups {
        id
        name
        memberCount
      }
    }
  }
  ${CATEGORY_FULL_FRAGMENT}
`;

export const GET_CATEGORIES_QUERY = gql`
  query GetCategories($filter: CategoryFilterInput) {
    categories(filter: $filter) {
      ...CategoryBasic
      parent {
        id
        name
      }
      coursesCount
      articlesCount
    }
  }
  ${CATEGORY_BASIC_FRAGMENT}
`;

export const GET_CATEGORY_TREE_QUERY = gql`
  query GetCategoryTree {
    categoryTree {
      categories {
        ...CategoryFull
      }
      totalCount
    }
  }
  ${CATEGORY_FULL_FRAGMENT}
`;

export const GET_CATEGORY_PATH_QUERY = gql`
  query GetCategoryPath($id: ID!) {
    categoryPath(id: $id) {
      id
      name
      slug
    }
  }
`;

// ============================================
// MUTATIONS
// ============================================

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      ...CategoryFull
    }
  }
  ${CATEGORY_FULL_FRAGMENT}
`;

export const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      ...CategoryFull
    }
  }
  ${CATEGORY_FULL_FRAGMENT}
`;

export const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      success
      message
    }
  }
`;

export const MOVE_CATEGORY_MUTATION = gql`
  mutation MoveCategory($id: ID!, $newParentId: ID) {
    moveCategory(id: $id, newParentId: $newParentId) {
      ...CategoryFull
    }
  }
  ${CATEGORY_FULL_FRAGMENT}
`;

export const REORDER_CATEGORIES_MUTATION = gql`
  mutation ReorderCategories($input: ReorderItemsInput!) {
    reorderCategories(input: $input) {
      id
      order
    }
  }
`;
