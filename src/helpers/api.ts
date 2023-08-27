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

const USER_FRAGMENT = gql`
  fragment userFragment on User {
    id
    name
    discussion_count
    vote_count
  }
`;

const CATEGORY_FRAGMENT = gql`
  fragment categoryFragment on Category {
    id
    category_id
    name
    about
    parent
    discussion_count
    category_count
  }
`;

const DISCUSSION_FRAGMENT = gql`
  fragment discussionFragment on Discussion {
    id
    discussion_id
    title
    content
    author {
      ...userFragment
    }
    score
    reply_count
    parent
    category {
      id
      category_id
      name
    }
  }
  ${USER_FRAGMENT}
`;

export const CATEGORIES_QUERY = gql`
  query ($first: Int, $parent: String) {
    categories(first: $first, where: { parent: $parent }) {
      ...categoryFragment
    }
  }
  ${CATEGORY_FRAGMENT}
`;

export const DISCUSSIONS_QUERY = gql`
  query ($first: Int, $category: String, $parent: Int) {
    discussions(
      first: $first
      where: { category: $category, parent: $parent }
      orderBy: score
      orderDirection: desc
    ) {
      ...discussionFragment
    }
  }
  ${DISCUSSION_FRAGMENT}
`;

export const DISCUSSION_QUERY = gql`
  query ($id: String!) {
    discussion(id: $id) {
      ...discussionFragment
    }
  }
  ${DISCUSSION_FRAGMENT}
`;

export const CATEGORY_QUERY = gql`
  query ($id: String!) {
    category(id: $id) {
      ...categoryFragment
    }
  }
  ${CATEGORY_FRAGMENT}
`;

export const VOTES_QUERY = gql`
  query ($voter: String!) {
    votes(where: { voter: $voter }) {
      id
      choice
      discussion {
        id
      }
    }
  }
`;
