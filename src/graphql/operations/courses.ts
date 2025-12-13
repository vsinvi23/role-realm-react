import { gql } from '@apollo/client';
import { 
  COURSE_BASIC_FRAGMENT, 
  COURSE_FULL_FRAGMENT, 
  SECTION_FRAGMENT, 
  LESSON_FRAGMENT,
  CONTENT_VERSION_FRAGMENT,
  PAGE_INFO_FRAGMENT 
} from '../fragments';

// ============================================
// QUERIES
// ============================================

export const GET_COURSE_QUERY = gql`
  query GetCourse($id: ID, $slug: String) {
    course(id: $id, slug: $slug) {
      ...CourseFull
    }
  }
  ${COURSE_FULL_FRAGMENT}
`;

export const GET_COURSES_QUERY = gql`
  query GetCourses(
    $filter: CourseFilterInput
    $sort: CourseSortInput
    $pagination: PaginationInput
  ) {
    courses(filter: $filter, sort: $sort, pagination: $pagination) {
      edges {
        node {
          ...CourseBasic
        }
        cursor
      }
      pageInfo {
        ...PageInfoFields
      }
      totalCount
    }
  }
  ${COURSE_BASIC_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

export const GET_SECTION_QUERY = gql`
  query GetSection($id: ID!) {
    section(id: $id) {
      ...SectionFields
    }
  }
  ${SECTION_FRAGMENT}
`;

export const GET_LESSON_QUERY = gql`
  query GetLesson($id: ID!) {
    lesson(id: $id) {
      ...LessonFields
      section {
        id
        title
        course {
          id
          title
          slug
        }
      }
      userProgress {
        completed
        progressPercent
        timeSpent
      }
    }
  }
  ${LESSON_FRAGMENT}
`;

export const GET_COURSE_VERSIONS_QUERY = gql`
  query GetCourseVersions($courseId: ID!) {
    courseVersions(courseId: $courseId) {
      ...ContentVersionFields
    }
  }
  ${CONTENT_VERSION_FRAGMENT}
`;

export const GET_COURSE_VERSION_QUERY = gql`
  query GetCourseVersion($courseId: ID!, $version: Int!) {
    courseVersion(courseId: $courseId, version: $version) {
      ...ContentVersionFields
      contentSnapshot
    }
  }
  ${CONTENT_VERSION_FRAGMENT}
`;

// ============================================
// MUTATIONS
// ============================================

export const CREATE_COURSE_MUTATION = gql`
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
      ...CourseBasic
    }
  }
  ${COURSE_BASIC_FRAGMENT}
`;

export const UPDATE_COURSE_MUTATION = gql`
  mutation UpdateCourse($id: ID!, $input: UpdateCourseInput!) {
    updateCourse(id: $id, input: $input) {
      ...CourseFull
    }
  }
  ${COURSE_FULL_FRAGMENT}
`;

export const DELETE_COURSE_MUTATION = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id) {
      success
      message
    }
  }
`;

export const DUPLICATE_COURSE_MUTATION = gql`
  mutation DuplicateCourse($id: ID!, $title: String!) {
    duplicateCourse(id: $id, title: $title) {
      ...CourseBasic
    }
  }
  ${COURSE_BASIC_FRAGMENT}
`;

// Section mutations
export const CREATE_SECTION_MUTATION = gql`
  mutation CreateSection($input: CreateSectionInput!) {
    createSection(input: $input) {
      ...SectionFields
    }
  }
  ${SECTION_FRAGMENT}
`;

export const UPDATE_SECTION_MUTATION = gql`
  mutation UpdateSection($id: ID!, $input: UpdateSectionInput!) {
    updateSection(id: $id, input: $input) {
      ...SectionFields
    }
  }
  ${SECTION_FRAGMENT}
`;

export const DELETE_SECTION_MUTATION = gql`
  mutation DeleteSection($id: ID!) {
    deleteSection(id: $id) {
      success
      message
    }
  }
`;

export const REORDER_SECTIONS_MUTATION = gql`
  mutation ReorderSections($courseId: ID!, $input: ReorderItemsInput!) {
    reorderSections(courseId: $courseId, input: $input) {
      id
      order
    }
  }
`;

// Lesson mutations
export const CREATE_LESSON_MUTATION = gql`
  mutation CreateLesson($input: CreateLessonInput!) {
    createLesson(input: $input) {
      ...LessonFields
    }
  }
  ${LESSON_FRAGMENT}
`;

export const UPDATE_LESSON_MUTATION = gql`
  mutation UpdateLesson($id: ID!, $input: UpdateLessonInput!) {
    updateLesson(id: $id, input: $input) {
      ...LessonFields
    }
  }
  ${LESSON_FRAGMENT}
`;

export const DELETE_LESSON_MUTATION = gql`
  mutation DeleteLesson($id: ID!) {
    deleteLesson(id: $id) {
      success
      message
    }
  }
`;

export const REORDER_LESSONS_MUTATION = gql`
  mutation ReorderLessons($sectionId: ID!, $input: ReorderItemsInput!) {
    reorderLessons(sectionId: $sectionId, input: $input) {
      id
      order
    }
  }
`;

// Attachment mutations
export const ADD_COURSE_ATTACHMENT_MUTATION = gql`
  mutation AddCourseAttachment($courseId: ID!, $input: AttachmentInput!) {
    addCourseAttachment(courseId: $courseId, input: $input) {
      id
      name
      url
      type
      size
    }
  }
`;

export const REMOVE_COURSE_ATTACHMENT_MUTATION = gql`
  mutation RemoveCourseAttachment($courseId: ID!, $attachmentId: ID!) {
    removeCourseAttachment(courseId: $courseId, attachmentId: $attachmentId) {
      success
      message
    }
  }
`;

export const ADD_LESSON_ATTACHMENT_MUTATION = gql`
  mutation AddLessonAttachment($lessonId: ID!, $input: AttachmentInput!) {
    addLessonAttachment(lessonId: $lessonId, input: $input) {
      id
      name
      url
      type
      size
    }
  }
`;

export const REMOVE_LESSON_ATTACHMENT_MUTATION = gql`
  mutation RemoveLessonAttachment($lessonId: ID!, $attachmentId: ID!) {
    removeLessonAttachment(lessonId: $lessonId, attachmentId: $attachmentId) {
      success
      message
    }
  }
`;

export const RESTORE_COURSE_VERSION_MUTATION = gql`
  mutation RestoreCourseVersion($courseId: ID!, $version: Int!) {
    restoreCourseVersion(courseId: $courseId, version: $version) {
      ...CourseFull
    }
  }
  ${COURSE_FULL_FRAGMENT}
`;
