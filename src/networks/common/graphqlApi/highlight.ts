import gql from 'graphql-tag';
import { ApiSpace, ApiProposal } from './types';

type HighlightSpace = {
  id: string;
  vote_count: number;
};

type HighlightProposal = {
  id: string;
  scores_1: string;
  scores_2: string;
  scores_3: string;
  scores_total: string;
  vote_count: number;
};

const SPACE_FRAGMENT = gql`
  fragment highlightSpaceFragment on SXSpace {
    id
    vote_count
  }
`;

const PROPOSAL_FRAGMENT = gql`
  fragment highlightProposalFragment on SXProposal {
    id
    scores_1
    scores_2
    scores_3
    scores_total
    vote_count
  }
`;

export const SPACE_QUERY = gql`
  query ($id: String!) {
    sxspace(id: $id) {
      ...highlightSpaceFragment
    }
  }
  ${SPACE_FRAGMENT}
`;

export const SPACES_QUERY = gql`
  query ($ids: [String!]!) {
    sxspaces(where: { id_in: $ids }) {
      ...highlightSpaceFragment
    }
  }
  ${SPACE_FRAGMENT}
`;

export const PROPOSAL_QUERY = gql`
  query ($id: String!) {
    sxproposal(id: $id) {
      ...highlightProposalFragment
    }
  }
  ${PROPOSAL_FRAGMENT}
`;

export const PROPOSALS_QUERY = gql`
  query ($ids: [String!]!) {
    sxproposals(where: { id_in: $ids }) {
      ...highlightProposalFragment
    }
  }
  ${PROPOSAL_FRAGMENT}
`;

export function joinHighlightSpace(
  space: ApiSpace,
  highlightSpace: HighlightSpace | null
): ApiSpace {
  if (!highlightSpace) return space;

  return {
    ...space,
    vote_count: space.vote_count + highlightSpace.vote_count
  };
}

export function joinHighlightProposal(
  proposal: ApiProposal,
  highlightProposal: HighlightProposal | null
): ApiProposal {
  if (!highlightProposal) return proposal;

  return {
    ...proposal,
    scores_1: Number(BigInt(proposal.scores_1) + BigInt(highlightProposal.scores_1)),
    scores_2: Number(BigInt(proposal.scores_2) + BigInt(highlightProposal.scores_2)),
    scores_3: Number(BigInt(proposal.scores_3) + BigInt(highlightProposal.scores_3)),
    scores_total: Number(BigInt(proposal.scores_total) + BigInt(highlightProposal.scores_total)),
    vote_count: proposal.vote_count + highlightProposal.vote_count
  };
}
