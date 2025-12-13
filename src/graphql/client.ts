import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// GraphQL API endpoint - replace with your actual endpoint
const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';

// HTTP link for GraphQL requests
const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
});

// Auth link to add authorization header
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('auth_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Apollo Client instance
export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          courses: {
            keyArgs: ['filter', 'sort'],
            merge(existing, incoming, { args }) {
              if (!args?.pagination?.page || args.pagination.page === 1) {
                return incoming;
              }
              return {
                ...incoming,
                edges: [...(existing?.edges || []), ...incoming.edges],
              };
            },
          },
          articles: {
            keyArgs: ['filter'],
            merge(existing, incoming, { args }) {
              if (!args?.pagination?.page || args.pagination.page === 1) {
                return incoming;
              }
              return {
                ...incoming,
                edges: [...(existing?.edges || []), ...incoming.edges],
              };
            },
          },
        },
      },
      Course: {
        fields: {
          sections: {
            merge: false,
          },
        },
      },
      Section: {
        fields: {
          lessons: {
            merge: false,
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// Helper to clear cache on logout
export const clearApolloCache = () => {
  apolloClient.clearStore();
};
