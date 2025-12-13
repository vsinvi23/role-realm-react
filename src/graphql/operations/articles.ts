import { gql } from '@apollo/client';
import { 
  ARTICLE_BASIC_FRAGMENT, 
  ARTICLE_FULL_FRAGMENT,
  CONTENT_VERSION_FRAGMENT,
  PAGE_INFO_FRAGMENT 
} from '../fragments';

// ============================================
// QUERIES
// ============================================

export const GET_ARTICLE_QUERY = gql`
  query GetArticle($id: ID, $slug: String) {
    article(id: $id, slug: $slug) {
      ...ArticleFull
    }
  }
  ${ARTICLE_FULL_FRAGMENT}
`;

export const GET_ARTICLES_QUERY = gql`
  query GetArticles(
    $filter: ArticleFilterInput
    $pagination: PaginationInput
  ) {
    articles(filter: $filter, pagination: $pagination) {
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

export const GET_ARTICLE_VERSIONS_QUERY = gql`
  query GetArticleVersions($articleId: ID!) {
    articleVersions(articleId: $articleId) {
      ...ContentVersionFields
    }
  }
  ${CONTENT_VERSION_FRAGMENT}
`;

export const GET_ARTICLE_VERSION_QUERY = gql`
  query GetArticleVersion($articleId: ID!, $version: Int!) {
    articleVersion(articleId: $articleId, version: $version) {
      ...ContentVersionFields
      contentSnapshot
    }
  }
  ${CONTENT_VERSION_FRAGMENT}
`;

export const GET_RELATED_ARTICLES_QUERY = gql`
  query GetRelatedArticles($articleId: ID!, $limit: Int) {
    relatedArticles(articleId: $articleId, limit: $limit) {
      ...ArticleBasic
    }
  }
  ${ARTICLE_BASIC_FRAGMENT}
`;

// ============================================
// MUTATIONS
// ============================================

export const CREATE_ARTICLE_MUTATION = gql`
  mutation CreateArticle($input: CreateArticleInput!) {
    createArticle(input: $input) {
      ...ArticleBasic
    }
  }
  ${ARTICLE_BASIC_FRAGMENT}
`;

export const UPDATE_ARTICLE_MUTATION = gql`
  mutation UpdateArticle($id: ID!, $input: UpdateArticleInput!) {
    updateArticle(id: $id, input: $input) {
      ...ArticleFull
    }
  }
  ${ARTICLE_FULL_FRAGMENT}
`;

export const DELETE_ARTICLE_MUTATION = gql`
  mutation DeleteArticle($id: ID!) {
    deleteArticle(id: $id) {
      success
      message
    }
  }
`;

export const DUPLICATE_ARTICLE_MUTATION = gql`
  mutation DuplicateArticle($id: ID!, $title: String!) {
    duplicateArticle(id: $id, title: $title) {
      ...ArticleBasic
    }
  }
  ${ARTICLE_BASIC_FRAGMENT}
`;

export const ADD_ARTICLE_ATTACHMENT_MUTATION = gql`
  mutation AddArticleAttachment($articleId: ID!, $input: AttachmentInput!) {
    addArticleAttachment(articleId: $articleId, input: $input) {
      id
      name
      url
      type
      size
    }
  }
`;

export const REMOVE_ARTICLE_ATTACHMENT_MUTATION = gql`
  mutation RemoveArticleAttachment($articleId: ID!, $attachmentId: ID!) {
    removeArticleAttachment(articleId: $articleId, attachmentId: $attachmentId) {
      success
      message
    }
  }
`;

export const RESTORE_ARTICLE_VERSION_MUTATION = gql`
  mutation RestoreArticleVersion($articleId: ID!, $version: Int!) {
    restoreArticleVersion(articleId: $articleId, version: $version) {
      ...ArticleFull
    }
  }
  ${ARTICLE_FULL_FRAGMENT}
`;
