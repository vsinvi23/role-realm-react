import { gql } from '@apollo/client';
import { 
  NOTIFICATION_FRAGMENT, 
  PAGE_INFO_FRAGMENT, 
  COURSE_BASIC_FRAGMENT, 
  ARTICLE_BASIC_FRAGMENT,
  USER_BASIC_FRAGMENT 
} from '../fragments';

// ============================================
// QUERIES
// ============================================

export const GET_MY_TASKS_QUERY = gql`
  query GetMyTasks($filter: TaskFilterInput, $pagination: PaginationInput) {
    myTasks(filter: $filter, pagination: $pagination) {
      edges {
        node {
          id
          contentType
          status
          ownershipType
          category {
            id
            name
          }
          author {
            ...UserBasic
          }
          assignedReviewers {
            ...UserBasic
          }
          dueDate
          createdAt
          updatedAt
          content {
            ... on Course {
              ...CourseBasic
            }
            ... on Article {
              ...ArticleBasic
            }
          }
        }
        cursor
      }
      pageInfo {
        ...PageInfoFields
      }
      totalCount
      stats {
        pendingReview
        myContent
        myDrafts
        published
        notifications
      }
    }
  }
  ${USER_BASIC_FRAGMENT}
  ${COURSE_BASIC_FRAGMENT}
  ${ARTICLE_BASIC_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

export const GET_TASK_STATS_QUERY = gql`
  query GetTaskStats {
    taskStats {
      pendingReview
      myContent
      myDrafts
      published
      notifications
    }
  }
`;

export const GET_NOTIFICATIONS_QUERY = gql`
  query GetNotifications($filter: NotificationFilterInput, $pagination: PaginationInput) {
    notifications(filter: $filter, pagination: $pagination) {
      edges {
        node {
          ...NotificationFields
        }
        cursor
      }
      pageInfo {
        ...PageInfoFields
      }
      totalCount
      unreadCount
    }
  }
  ${NOTIFICATION_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

export const GET_UNREAD_NOTIFICATIONS_COUNT_QUERY = gql`
  query GetUnreadNotificationsCount {
    unreadNotificationsCount
  }
`;

// ============================================
// MUTATIONS
// ============================================

export const MARK_NOTIFICATION_READ_MUTATION = gql`
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id) {
      ...NotificationFields
    }
  }
  ${NOTIFICATION_FRAGMENT}
`;

export const MARK_ALL_NOTIFICATIONS_READ_MUTATION = gql`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead {
      success
      message
    }
  }
`;

export const DELETE_NOTIFICATION_MUTATION = gql`
  mutation DeleteNotification($id: ID!) {
    deleteNotification(id: $id) {
      success
      message
    }
  }
`;

export const CLEAR_ALL_NOTIFICATIONS_MUTATION = gql`
  mutation ClearAllNotifications {
    clearAllNotifications {
      success
      message
    }
  }
`;
