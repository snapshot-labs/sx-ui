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

export async function loadTopicVotes(voter: string) {
  const { data } = await apollo.query({
    query: TOPIC_VOTES_QUERY,
    variables: {
      voter
    }
  });

  return data.topicvotes;
}

const USER_FRAGMENT = gql`
  fragment userFragment on User {
    id
    name
    topic_count
    vote_count
  }
`;

const CATEGORY_FRAGMENT = gql`
  fragment categoryFragment on Category {
    id
    name
    about
    parent
    topic_count
    category_count
  }
`;

const TOPIC_FRAGMENT = gql`
  fragment topicFragment on Topic {
    id
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
      name
    }
  }
  ${USER_FRAGMENT}
`;

export const CATEGORIES_QUERY = gql`
  query ($first: Int, $parent: Int) {
    categories(first: $first, where: { parent: $parent }) {
      ...categoryFragment
    }
  }
  ${CATEGORY_FRAGMENT}
`;

export const TOPICS_QUERY = gql`
  query ($first: Int, $category: String, $parent: Int) {
    topics(
      first: $first
      where: { category: $category, parent: $parent }
      orderBy: score
      orderDirection: desc
    ) {
      ...topicFragment
    }
  }
  ${TOPIC_FRAGMENT}
`;

export const TOPIC_QUERY = gql`
  query ($id: String!) {
    topic(id: $id) {
      ...topicFragment
    }
  }
  ${TOPIC_FRAGMENT}
`;

export const CATEGORY_QUERY = gql`
  query ($id: String!) {
    category(id: $id) {
      ...categoryFragment
    }
  }
  ${CATEGORY_FRAGMENT}
`;

export const TOPIC_VOTES_QUERY = gql`
  query ($voter: String!) {
    topicvotes(where: { voter: $voter }) {
      id
      choice
      topic {
        id
      }
    }
  }
`;
