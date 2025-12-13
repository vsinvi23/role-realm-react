import { gql } from '@apollo/client';
import { COURSE_BASIC_FRAGMENT, ARTICLE_BASIC_FRAGMENT, CATEGORY_BASIC_FRAGMENT, PAGE_INFO_FRAGMENT } from '../fragments';

// ============================================
// QUERIES
// ============================================

export const GET_FEATURED_CONTENT_QUERY = gql`
  query GetFeaturedContent {
    featuredContent {
      featuredCourses {
        ...CourseBasic
      }
      featuredArticles {
        ...ArticleBasic
      }
      popularCourses {
        ...CourseBasic
      }
      recentArticles {
        ...ArticleBasic
      }
      learningPaths {
        id
        name
        slug
        description
        icon
        coursesCount
        estimatedDuration
      }
    }
  }
  ${COURSE_BASIC_FRAGMENT}
  ${ARTICLE_BASIC_FRAGMENT}
`;

export const GET_LEARNING_PATHS_QUERY = gql`
  query GetLearningPaths {
    learningPaths {
      id
      name
      slug
      description
      icon
      coursesCount
      estimatedDuration
      order
    }
  }
`;

export const GET_LEARNING_PATH_QUERY = gql`
  query GetLearningPath($slug: String!) {
    learningPath(slug: $slug) {
      id
      name
      slug
      description
      icon
      estimatedDuration
      courses {
        ...CourseBasic
      }
      coursesCount
    }
  }
  ${COURSE_BASIC_FRAGMENT}
`;

export const GET_TECHNOLOGY_PAGE_QUERY = gql`
  query GetTechnologyPage($slug: String!) {
    technologyPage(slug: $slug) {
      category {
        ...CategoryBasic
        parent {
          id
          name
          slug
        }
      }
      courses {
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
      articles {
        edges {
          node {
            ...ArticleBasic
          }
          cursor
        }
        pageInfo {
          ...PageInfoFields
        }
        totalCount
      }
      relatedCategories {
        ...CategoryBasic
      }
    }
  }
  ${CATEGORY_BASIC_FRAGMENT}
  ${COURSE_BASIC_FRAGMENT}
  ${ARTICLE_BASIC_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

export const GET_PUBLIC_COURSES_QUERY = gql`
  query GetPublicCourses($categorySlug: String, $pagination: PaginationInput) {
    publicCourses(categorySlug: $categorySlug, pagination: $pagination) {
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

export const GET_PUBLIC_ARTICLES_QUERY = gql`
  query GetPublicArticles($categorySlug: String, $pagination: PaginationInput) {
    publicArticles(categorySlug: $categorySlug, pagination: $pagination) {
      edges {
        node {
          ...ArticleBasic
        }
        cursor
      }
      pageInfo {
        ...PageInfoFields
      }
      totalCount
    }
  }
  ${ARTICLE_BASIC_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;
