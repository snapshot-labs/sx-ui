import type { Wallet } from '@ethersproject/wallet';
import type { Web3Provider } from '@ethersproject/providers';
import type { MetaTransaction } from '@snapshot-labs/sx/dist/utils/encoding';
import type { Space, Proposal, Vote, User, Choice } from '@/types';

export type PaginationOpts = { limit: number; skip?: number };

// TODO: make sx.js accept Signer instead of Web3Provider | Wallet

export type NetworkActions = {
  propose(
    signer: Web3Provider | Wallet,
    account: string,
    space: Space,
    cid: string,
    transactions: MetaTransaction[]
  );
  vote(signer: Web3Provider | Wallet, account: string, proposal: Proposal, choice: Choice);
  finalizeProposal(signer: Web3Provider | Wallet, proposal: Proposal);
  receiveProposal(signer: Web3Provider | Wallet, proposal: Proposal);
  executeTransactions(signer: Web3Provider | Wallet, proposal: Proposal);
  send(envelope: any): Promise<any>;
};

export type NetworkApi = {
  loadProposalVotes(proposal: Proposal): Promise<Vote[]>;
  loadUserVotes(voter: string): Promise<{ [key: string]: Vote }>;
  loadProposals(spaceId: string, paginationOpts: PaginationOpts): Promise<Proposal[]>;
  loadProposalsSummary(spaceId: string, limit: number): Promise<Proposal[]>;
  loadProposal(spaceId: string, proposalId: number): Promise<Proposal>;
  loadSpaces(paginationOpts: PaginationOpts): Promise<Space[]>;
  loadSpace(spaceId: string): Promise<Space>;
  loadUser(userId: string): Promise<User>;
};

export type Network = {
  hasRelayer: boolean;
  hasReceive: boolean;
  actions: NetworkActions;
  api: NetworkApi;
  constants: {
    API_URL: string;
    SUPPORTED_AUTHENTICATORS: { [key: string]: boolean };
    SUPPORTED_STRATEGIES: { [key: string]: boolean };
    SUPPORTED_EXECUTORS: { [key: string]: boolean };
    AUTHS: { [key: string]: string };
    STRATEGIES: { [key: string]: string };
    EXECUTORS: { [key: string]: string };
  };
  helpers: {
    waitForTransaction(txId: string): Promise<any>;
    getTransactionLink(txId: string): string;
  };
};
