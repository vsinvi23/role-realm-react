import { gql } from '@apollo/client';
import { WORKFLOW_EVENT_FRAGMENT, REVIEW_COMMENT_FRAGMENT, USER_BASIC_FRAGMENT } from '../fragments';

// ============================================
// QUERIES
// ============================================

export const GET_WORKFLOW_HISTORY_QUERY = gql`
  query GetWorkflowHistory($contentId: ID!, $contentType: ContentType!) {
    workflowHistory(contentId: $contentId, contentType: $contentType) {
      ...WorkflowEventFields
    }
  }
  ${WORKFLOW_EVENT_FRAGMENT}
`;

export const GET_REVIEW_COMMENTS_QUERY = gql`
  query GetReviewComments($contentId: ID!, $contentType: ContentType!) {
    reviewComments(contentId: $contentId, contentType: $contentType) {
      ...ReviewCommentFields
    }
  }
  ${REVIEW_COMMENT_FRAGMENT}
`;

export const GET_SCHEDULED_PUBLISHES_QUERY = gql`
  query GetScheduledPublishes {
    scheduledPublishes {
      id
      contentId
      contentType
      publishAt
      timezone
      status
      createdBy {
        ...UserBasic
      }
      createdAt
    }
  }
  ${USER_BASIC_FRAGMENT}
`;

// ============================================
// MUTATIONS
// ============================================

export const SUBMIT_FOR_REVIEW_MUTATION = gql`
  mutation SubmitForReview($input: SubmitForReviewInput!) {
    submitForReview(input: $input) {
      success
      message
    }
  }
`;

export const REVIEW_CONTENT_MUTATION = gql`
  mutation ReviewContent($input: ReviewActionInput!) {
    reviewContent(input: $input) {
      success
      message
    }
  }
`;

export const PUBLISH_CONTENT_MUTATION = gql`
  mutation PublishContent($contentId: ID!, $contentType: ContentType!) {
    publishContent(contentId: $contentId, contentType: $contentType) {
      success
      message
    }
  }
`;

export const UNPUBLISH_CONTENT_MUTATION = gql`
  mutation UnpublishContent($contentId: ID!, $contentType: ContentType!) {
    unpublishContent(contentId: $contentId, contentType: $contentType) {
      success
      message
    }
  }
`;

export const SCHEDULE_PUBLISH_MUTATION = gql`
  mutation SchedulePublish($input: SchedulePublishInput!) {
    schedulePublish(input: $input) {
      id
      contentId
      contentType
      publishAt
      timezone
      status
      createdAt
    }
  }
`;

export const CANCEL_SCHEDULED_PUBLISH_MUTATION = gql`
  mutation CancelScheduledPublish($id: ID!) {
    cancelScheduledPublish(id: $id) {
      success
      message
    }
  }
`;

export const ADD_REVIEW_COMMENT_MUTATION = gql`
  mutation AddReviewComment($input: AddReviewCommentInput!) {
    addReviewComment(input: $input) {
      ...ReviewCommentFields
    }
  }
  ${REVIEW_COMMENT_FRAGMENT}
`;

export const RESOLVE_REVIEW_COMMENT_MUTATION = gql`
  mutation ResolveReviewComment($id: ID!) {
    resolveReviewComment(id: $id) {
      ...ReviewCommentFields
    }
  }
  ${REVIEW_COMMENT_FRAGMENT}
`;

export const DELETE_REVIEW_COMMENT_MUTATION = gql`
  mutation DeleteReviewComment($id: ID!) {
    deleteReviewComment(id: $id) {
      success
      message
    }
  }
`;
