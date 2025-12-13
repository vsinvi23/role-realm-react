import { gql } from '@apollo/client';
import { COURSE_BASIC_FRAGMENT, ARTICLE_BASIC_FRAGMENT, USER_BASIC_FRAGMENT } from '../fragments';

// ============================================
// QUERIES
// ============================================

export const GET_DASHBOARD_ANALYTICS_QUERY = gql`
  query GetDashboardAnalytics($filter: AnalyticsFilterInput) {
    dashboardAnalytics(filter: $filter) {
      overview {
        totalUsers
        activeUsers
        totalCourses
        publishedCourses
        totalArticles
        publishedArticles
        totalEnrollments
        completionRate
      }
      userGrowth {
        date
        value
        label
      }
      contentStats {
        coursesPublished
        articlesPublished
        pendingReview
        drafts
        publishedThisMonth
        publishedLastMonth
        growthPercent
      }
      topCourses {
        course {
          ...CourseBasic
        }
        enrollments
        completions
        completionRate
        averageRating
      }
      topArticles {
        article {
          ...ArticleBasic
        }
        views
        uniqueViews
        likes
        comments
        shares
        averageReadTime
      }
      enrollmentTrends {
        date
        value
        label
      }
      categoryDistribution {
        category {
          id
          name
          slug
        }
        coursesCount
        articlesCount
        enrollmentsCount
      }
    }
  }
  ${COURSE_BASIC_FRAGMENT}
  ${ARTICLE_BASIC_FRAGMENT}
`;

export const GET_COURSE_ANALYTICS_QUERY = gql`
  query GetCourseAnalytics($courseId: ID!, $filter: AnalyticsFilterInput) {
    courseAnalytics(courseId: $courseId, filter: $filter) {
      course {
        ...CourseBasic
      }
      enrollments
      completions
      completionRate
      averageRating
      revenue
    }
  }
  ${COURSE_BASIC_FRAGMENT}
`;

export const GET_ARTICLE_ANALYTICS_QUERY = gql`
  query GetArticleAnalytics($articleId: ID!, $filter: AnalyticsFilterInput) {
    articleAnalytics(articleId: $articleId, filter: $filter) {
      article {
        ...ArticleBasic
      }
      views
      uniqueViews
      likes
      comments
      shares
      averageReadTime
    }
  }
  ${ARTICLE_BASIC_FRAGMENT}
`;

export const GET_USER_ANALYTICS_QUERY = gql`
  query GetUserAnalytics($userId: ID!) {
    userAnalytics(userId: $userId) {
      user {
        ...UserBasic
      }
      coursesEnrolled
      coursesCompleted
      articlesRead
      totalTimeSpent
      lastActiveAt
      streakDays
    }
  }
  ${USER_BASIC_FRAGMENT}
`;
