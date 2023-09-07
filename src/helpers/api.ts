import gql from 'graphql-tag';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL || ''
});

export const apollo = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    addTypename: false
  }),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache'
    }
  }
});

export const SX_VOTES_QUERY = gql`
  query ($first: Int!, $skip: Int!, $space: String, $proposal: Int) {
    sxvotes(
      first: $first
      skip: $skip
      where: { space: $space, proposal: $proposal }
      orderBy: vp
      orderDirection: desc
    ) {
      id
      voter
      space
      proposal
      choice
      vp
      created
    }
  }
`;
