import { gql } from '@apollo/client';
import { COMMENT_FRAGMENT, PAGE_INFO_FRAGMENT, USER_BASIC_FRAGMENT } from '../fragments';

// ============================================
// QUERIES
// ============================================

export const GET_COMMENTS_QUERY = gql`
  query GetComments(
    $contentId: ID!
    $contentType: ContentType!
    $pagination: PaginationInput
  ) {
    comments(contentId: $contentId, contentType: $contentType, pagination: $pagination) {
      edges {
        node {
          ...CommentFields
          replies {
            ...CommentFields
          }
        }
        cursor
      }
      pageInfo {
        ...PageInfoFields
      }
      totalCount
    }
  }
  ${COMMENT_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

// ============================================
// MUTATIONS
// ============================================

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      ...CommentFields
    }
  }
  ${COMMENT_FRAGMENT}
`;

export const UPDATE_COMMENT_MUTATION = gql`
  mutation UpdateComment($id: ID!, $input: UpdateCommentInput!) {
    updateComment(id: $id, input: $input) {
      ...CommentFields
    }
  }
  ${COMMENT_FRAGMENT}
`;

export const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id) {
      success
      message
    }
  }
`;

export const LIKE_COMMENT_MUTATION = gql`
  mutation LikeComment($id: ID!) {
    likeComment(id: $id) {
      id
      likesCount
      isLiked
    }
  }
`;

export const UNLIKE_COMMENT_MUTATION = gql`
  mutation UnlikeComment($id: ID!) {
    unlikeComment(id: $id) {
      id
      likesCount
      isLiked
    }
  }
`;

export const REPORT_COMMENT_MUTATION = gql`
  mutation ReportComment($id: ID!, $reason: String!) {
    reportComment(id: $id, reason: $reason) {
      success
      message
    }
  }
`;
