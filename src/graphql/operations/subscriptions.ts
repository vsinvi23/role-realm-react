import { gql } from '@apollo/client';
import { NOTIFICATION_FRAGMENT, COMMENT_FRAGMENT, WORKFLOW_EVENT_FRAGMENT, REVIEW_COMMENT_FRAGMENT } from '../fragments';

// ============================================
// SUBSCRIPTIONS
// ============================================

export const NOTIFICATION_RECEIVED_SUBSCRIPTION = gql`
  subscription NotificationReceived {
    notificationReceived {
      ...NotificationFields
    }
  }
  ${NOTIFICATION_FRAGMENT}
`;

export const COURSE_PROGRESS_UPDATED_SUBSCRIPTION = gql`
  subscription CourseProgressUpdated($courseId: ID!) {
    courseProgressUpdated(courseId: $courseId) {
      totalLessons
      completedLessons
      progressPercent
      lastAccessedAt
    }
  }
`;

export const COMMENT_ADDED_SUBSCRIPTION = gql`
  subscription CommentAdded($contentId: ID!, $contentType: ContentType!) {
    commentAdded(contentId: $contentId, contentType: $contentType) {
      ...CommentFields
    }
  }
  ${COMMENT_FRAGMENT}
`;

export const WORKFLOW_STATUS_CHANGED_SUBSCRIPTION = gql`
  subscription WorkflowStatusChanged($contentId: ID!, $contentType: ContentType!) {
    workflowStatusChanged(contentId: $contentId, contentType: $contentType) {
      ...WorkflowEventFields
    }
  }
  ${WORKFLOW_EVENT_FRAGMENT}
`;

export const REVIEW_COMMENT_ADDED_SUBSCRIPTION = gql`
  subscription ReviewCommentAdded($contentId: ID!, $contentType: ContentType!) {
    reviewCommentAdded(contentId: $contentId, contentType: $contentType) {
      ...ReviewCommentFields
    }
  }
  ${REVIEW_COMMENT_FRAGMENT}
`;
