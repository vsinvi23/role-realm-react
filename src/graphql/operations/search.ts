import { gql } from '@apollo/client';
import { COURSE_BASIC_FRAGMENT, ARTICLE_BASIC_FRAGMENT, PAGE_INFO_FRAGMENT } from '../fragments';

// ============================================
// QUERIES
// ============================================

export const SEARCH_QUERY = gql`
  query Search($input: SearchInput!) {
    search(input: $input) {
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
      totalCount
      query
      suggestions
    }
  }
  ${COURSE_BASIC_FRAGMENT}
  ${ARTICLE_BASIC_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

export const SEARCH_SUGGESTIONS_QUERY = gql`
  query SearchSuggestions($query: String!) {
    searchSuggestions(query: $query) {
      text
      type
      count
    }
  }
`;
