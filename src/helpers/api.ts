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

export async function loadDiscussionVotes(voter: string) {
  const { data } = await apollo.query({
    query: VOTES_QUERY,
    variables: {
      voter
    }
  });

  return data.votes;
}

export const CATEGORIES_QUERY = gql`
  query {
    categories(where: { parent: 0 }) {
      id
      category_id
      name
      about
      discussion_count
    }
  }
`;

export const LATEST_DISCUSSIONS_QUERY = gql`
  query {
    discussions(first: 5, where: { parent: 0 }, orderBy: discussion_id, orderDirection: desc) {
      id
      discussion_id
      title
      content
      author
      score
      discussion_count
    }
  }
`;

export const DISCUSSIONS_QUERY = gql`
  query ($category: String, $parent: Int) {
    discussions(
      where: { category: $category, parent: $parent }
      orderBy: score
      orderDirection: desc
    ) {
      id
      discussion_id
      title
      content
      author
      score
      discussion_count
    }
  }
`;

export const DISCUSSION_QUERY = gql`
  query ($id: String!) {
    discussion(id: $id) {
      id
      discussion_id
      title
      category {
        id
        category_id
        name
      }
      content
      author
      score
      discussion_count
    }
  }
`;

export const CATEGORY_QUERY = gql`
  query ($id: String!) {
    category(id: $id) {
      id
      category_id
      name
      about
      discussion_count
    }
  }
`;

export const VOTES_QUERY = gql`
  query ($voter: String!) {
    votes(where: { voter: $voter }) {
      id
      discussion {
        id
      }
      choice
    }
  }
`;
