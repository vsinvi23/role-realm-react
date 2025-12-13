import { gql } from '@apollo/client';

// ============================================
// USER FRAGMENTS
// ============================================

export const USER_BASIC_FRAGMENT = gql`
  fragment UserBasic on User {
    id
    email
    firstName
    lastName
    fullName
    avatar
    status
  }
`;

export const USER_FULL_FRAGMENT = gql`
  fragment UserFull on User {
    ...UserBasic
    role {
      id
      name
      type
    }
    userGroups {
      id
      name
    }
    createdAt
    updatedAt
    lastLoginAt
  }
  ${USER_BASIC_FRAGMENT}
`;

// ============================================
// ROLE & PERMISSION FRAGMENTS
// ============================================

export const PERMISSION_FRAGMENT = gql`
  fragment PermissionFields on Permission {
    id
    module
    actions
  }
`;

export const ROLE_FRAGMENT = gql`
  fragment RoleFields on Role {
    id
    name
    description
    type
    isCustom
    permissions {
      ...PermissionFields
    }
    createdAt
    updatedAt
  }
  ${PERMISSION_FRAGMENT}
`;

export const USER_GROUP_FRAGMENT = gql`
  fragment UserGroupFields on UserGroup {
    id
    name
    description
    role {
      id
      name
    }
    memberCount
    categories {
      id
      name
    }
    createdAt
  }
`;

// ============================================
// CATEGORY FRAGMENTS
// ============================================

export const CATEGORY_BASIC_FRAGMENT = gql`
  fragment CategoryBasic on Category {
    id
    name
    slug
    description
    icon
    order
    depth
  }
`;

export const CATEGORY_FULL_FRAGMENT = gql`
  fragment CategoryFull on Category {
    ...CategoryBasic
    parent {
      id
      name
      slug
    }
    children {
      ...CategoryBasic
    }
    coursesCount
    articlesCount
  }
  ${CATEGORY_BASIC_FRAGMENT}
`;

// ============================================
// COURSE FRAGMENTS
// ============================================

export const LESSON_FRAGMENT = gql`
  fragment LessonFields on Lesson {
    id
    title
    type
    content
    videoUrl
    duration
    order
    isFree
    attachments {
      id
      name
      url
      type
      size
    }
    isCompleted
  }
`;

export const SECTION_FRAGMENT = gql`
  fragment SectionFields on Section {
    id
    title
    description
    order
    lessonsCount
    duration
    lessons {
      ...LessonFields
    }
  }
  ${LESSON_FRAGMENT}
`;

export const COURSE_BASIC_FRAGMENT = gql`
  fragment CourseBasic on Course {
    id
    title
    slug
    shortDescription
    thumbnail
    level
    duration
    tags
    status
    enrollmentsCount
    averageRating
    reviewsCount
    category {
      id
      name
      slug
    }
    instructor {
      ...UserBasic
    }
  }
  ${USER_BASIC_FRAGMENT}
`;

export const COURSE_FULL_FRAGMENT = gql`
  fragment CourseFull on Course {
    ...CourseBasic
    description
    author {
      ...UserBasic
    }
    sections {
      ...SectionFields
    }
    sectionsCount
    lessonsCount
    currentVersion
    publishedAt
    createdAt
    updatedAt
    isEnrolled
    isBookmarked
    userProgress {
      totalLessons
      completedLessons
      progressPercent
      lastAccessedAt
    }
  }
  ${COURSE_BASIC_FRAGMENT}
  ${SECTION_FRAGMENT}
`;

// ============================================
// ARTICLE FRAGMENTS
// ============================================

export const ARTICLE_BASIC_FRAGMENT = gql`
  fragment ArticleBasic on Article {
    id
    title
    slug
    excerpt
    thumbnail
    tags
    status
    readingTime
    viewsCount
    likesCount
    commentsCount
    category {
      id
      name
      slug
    }
    author {
      ...UserBasic
    }
    publishedAt
    createdAt
  }
  ${USER_BASIC_FRAGMENT}
`;

export const ARTICLE_FULL_FRAGMENT = gql`
  fragment ArticleFull on Article {
    ...ArticleBasic
    content
    seoTitle
    seoDescription
    seoKeywords
    canonicalUrl
    attachments {
      id
      name
      url
      type
      size
    }
    currentVersion
    updatedAt
    isBookmarked
    isLiked
  }
  ${ARTICLE_BASIC_FRAGMENT}
`;

// ============================================
// WORKFLOW FRAGMENTS
// ============================================

export const WORKFLOW_EVENT_FRAGMENT = gql`
  fragment WorkflowEventFields on WorkflowEvent {
    id
    fromStatus
    toStatus
    action
    performedBy {
      ...UserBasic
    }
    comment
    createdAt
  }
  ${USER_BASIC_FRAGMENT}
`;

export const REVIEW_COMMENT_FRAGMENT = gql`
  fragment ReviewCommentFields on ReviewComment {
    id
    content
    author {
      ...UserBasic
    }
    isResolved
    createdAt
    updatedAt
    replies {
      id
      content
      author {
        ...UserBasic
      }
      createdAt
    }
  }
  ${USER_BASIC_FRAGMENT}
`;

export const CONTENT_VERSION_FRAGMENT = gql`
  fragment ContentVersionFields on ContentVersion {
    id
    version
    createdBy {
      ...UserBasic
    }
    createdAt
    changeDescription
  }
  ${USER_BASIC_FRAGMENT}
`;

// ============================================
// ENROLLMENT FRAGMENTS
// ============================================

export const ENROLLMENT_FRAGMENT = gql`
  fragment EnrollmentFields on Enrollment {
    id
    enrolledAt
    completedAt
    course {
      ...CourseBasic
    }
    progress {
      totalLessons
      completedLessons
      progressPercent
      totalTimeSpent
    }
  }
  ${COURSE_BASIC_FRAGMENT}
`;

// ============================================
// COMMENT FRAGMENTS
// ============================================

export const COMMENT_FRAGMENT = gql`
  fragment CommentFields on Comment {
    id
    content
    author {
      ...UserBasic
    }
    repliesCount
    likesCount
    status
    isLiked
    createdAt
    updatedAt
  }
  ${USER_BASIC_FRAGMENT}
`;

// ============================================
// NOTIFICATION FRAGMENTS
// ============================================

export const NOTIFICATION_FRAGMENT = gql`
  fragment NotificationFields on Notification {
    id
    type
    title
    message
    isRead
    relatedContentId
    relatedContentType
    actionUrl
    sender {
      ...UserBasic
    }
    createdAt
  }
  ${USER_BASIC_FRAGMENT}
`;

// ============================================
// PAGINATION FRAGMENTS
// ============================================

export const PAGE_INFO_FRAGMENT = gql`
  fragment PageInfoFields on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
    totalPages
    currentPage
  }
`;
