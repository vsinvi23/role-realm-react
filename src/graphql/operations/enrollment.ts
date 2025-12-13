import { gql } from '@apollo/client';
import { ENROLLMENT_FRAGMENT, COURSE_BASIC_FRAGMENT, LESSON_FRAGMENT } from '../fragments';

// ============================================
// QUERIES
// ============================================

export const GET_MY_ENROLLMENTS_QUERY = gql`
  query GetMyEnrollments {
    myEnrollments {
      ...EnrollmentFields
    }
  }
  ${ENROLLMENT_FRAGMENT}
`;

export const GET_ENROLLMENT_QUERY = gql`
  query GetEnrollment($courseId: ID!) {
    enrollment(courseId: $courseId) {
      ...EnrollmentFields
      progress {
        totalLessons
        completedLessons
        progressPercent
        lastAccessedLesson {
          id
          title
        }
        lastAccessedAt
        totalTimeSpent
        lessonProgresses {
          lesson {
            id
            title
          }
          completed
          progressPercent
          timeSpent
          completedAt
        }
      }
    }
  }
  ${ENROLLMENT_FRAGMENT}
`;

export const GET_COURSE_PROGRESS_QUERY = gql`
  query GetCourseProgress($courseId: ID!) {
    courseProgress(courseId: $courseId) {
      totalLessons
      completedLessons
      progressPercent
      lastAccessedLesson {
        id
        title
        section {
          id
          title
        }
      }
      lastAccessedAt
      totalTimeSpent
    }
  }
`;

export const GET_MY_BOOKMARKS_QUERY = gql`
  query GetMyBookmarks($contentType: ContentType) {
    myBookmarks(contentType: $contentType) {
      id
      contentId
      contentType
      createdAt
      content {
        ... on Course {
          ...CourseBasic
        }
        ... on Article {
          id
          title
          slug
          excerpt
          thumbnail
          readingTime
        }
      }
    }
  }
  ${COURSE_BASIC_FRAGMENT}
`;

export const GET_MY_CERTIFICATES_QUERY = gql`
  query GetMyCertificates {
    myCertificates {
      id
      issueDate
      certificateUrl
      certificateNumber
      enrollment {
        course {
          id
          title
          slug
          thumbnail
        }
        completedAt
      }
    }
  }
`;

// ============================================
// MUTATIONS
// ============================================

export const ENROLL_COURSE_MUTATION = gql`
  mutation EnrollCourse($input: EnrollCourseInput!) {
    enrollCourse(input: $input) {
      ...EnrollmentFields
    }
  }
  ${ENROLLMENT_FRAGMENT}
`;

export const UNENROLL_COURSE_MUTATION = gql`
  mutation UnenrollCourse($courseId: ID!) {
    unenrollCourse(courseId: $courseId) {
      success
      message
    }
  }
`;

export const UPDATE_LESSON_PROGRESS_MUTATION = gql`
  mutation UpdateLessonProgress($input: UpdateProgressInput!) {
    updateLessonProgress(input: $input) {
      lesson {
        id
        title
      }
      completed
      progressPercent
      timeSpent
      completedAt
      lastAccessedAt
    }
  }
`;

export const MARK_LESSON_COMPLETE_MUTATION = gql`
  mutation MarkLessonComplete($lessonId: ID!) {
    markLessonComplete(lessonId: $lessonId) {
      lesson {
        id
        title
      }
      completed
      completedAt
    }
  }
`;

export const MARK_LESSON_INCOMPLETE_MUTATION = gql`
  mutation MarkLessonIncomplete($lessonId: ID!) {
    markLessonIncomplete(lessonId: $lessonId) {
      lesson {
        id
        title
      }
      completed
    }
  }
`;

export const RESET_COURSE_PROGRESS_MUTATION = gql`
  mutation ResetCourseProgress($courseId: ID!) {
    resetCourseProgress(courseId: $courseId) {
      success
      message
    }
  }
`;

export const ADD_BOOKMARK_MUTATION = gql`
  mutation AddBookmark($input: BookmarkInput!) {
    addBookmark(input: $input) {
      id
      contentId
      contentType
      createdAt
    }
  }
`;

export const REMOVE_BOOKMARK_MUTATION = gql`
  mutation RemoveBookmark($contentId: ID!, $contentType: ContentType!) {
    removeBookmark(contentId: $contentId, contentType: $contentType) {
      success
      message
    }
  }
`;

export const GENERATE_CERTIFICATE_MUTATION = gql`
  mutation GenerateCertificate($enrollmentId: ID!) {
    generateCertificate(enrollmentId: $enrollmentId) {
      id
      issueDate
      certificateUrl
      certificateNumber
    }
  }
`;
