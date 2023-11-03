import { FunctionalComponent } from 'vue';
import type { Web3Provider } from '@ethersproject/providers';
import type { Signer } from '@ethersproject/abstract-signer';
import type { MetaTransaction } from '@snapshot-labs/sx/dist/utils/encoding';
import type {
  Space,
  SpaceMetadata,
  Proposal,
  Vote,
  User,
  Choice,
  NetworkID,
  StrategyParsedMetadata
} from '@/types';

export type PaginationOpts = { limit: number; skip?: number };
export type SpacesFilter = {
  controller?: string;
  id_in?: string[];
};
export type Connector = 'argentx' | 'injected' | 'walletconnect' | 'walletlink' | 'gnosis';

export type StrategyTemplate = {
  address: string;
  name: string;
  about?: string;
  icon?: FunctionalComponent;
  type?: string;
  paramsDefinition: any;
  validate?: (params: Record<string, any>) => boolean;
  generateSummary?: (params: Record<string, any>) => string;
  generateParams?: (params: Record<string, any>) => any[];
  generateMetadata?: (params: Record<string, any>) => any;
  deploy?: (
    client: any,
    signer: Signer,
    controller: string,
    spaceAddress: string,
    params: Record<string, any>
  ) => Promise<{ address: string; txId: string }>;
};

export type StrategyConfig = StrategyTemplate & {
  id: string;
  params: Record<string, any>;
};

export type VotingPower = {
  address: string;
  value: bigint;
  decimals: number;
  token: string | null;
  symbol: string;
};

// TODO: make sx.js accept Signer instead of Web3Provider | Wallet

type ReadOnlyNetworkActions = {
  getVotingPower(
    strategiesAddresses: string[],
    strategiesParams: any[],
    strategiesMetadata: StrategyParsedMetadata[],
    voterAddress: string,
    current: number | null
  ): Promise<VotingPower[]>;
};

export type NetworkActions = ReadOnlyNetworkActions & {
  predictSpaceAddress(web3: Web3Provider, params: { salt: string }): Promise<string | null>;
  deployDependency(
    web3: Web3Provider,
    params: {
      controller: string;
      spaceAddress: string;
      strategy: StrategyConfig;
    }
  ): Promise<{ address: string; txId: string }>;
  createSpace(
    web3: Web3Provider,
    salt: string,
    params: {
      controller: string;
      votingDelay: number;
      minVotingDuration: number;
      maxVotingDuration: number;
      authenticators: StrategyConfig[];
      validationStrategy: StrategyConfig;
      votingStrategies: StrategyConfig[];
      executionStrategies: StrategyConfig[];
      metadata: SpaceMetadata;
    }
  );
  setMetadata(web3: Web3Provider, space: Space, metadata: SpaceMetadata);
  propose(
    web3: Web3Provider,
    connectorType: Connector,
    account: string,
    space: Space,
    cid: string,
    executionStrategy: string | null,
    transactions: MetaTransaction[]
  );
  updateProposal(
    web3: Web3Provider,
    connectorType: Connector,
    account: string,
    space: Space,
    proposalId: number | string,
    cid: string,
    executionStrategy: string | null,
    transactions: MetaTransaction[]
  );
  cancelProposal(web3: Web3Provider, proposal: Proposal);
  vote(
    web3: Web3Provider,
    connectorType: Connector,
    account: string,
    proposal: Proposal,
    choice: Choice
  );
  finalizeProposal(web3: Web3Provider, proposal: Proposal);
  receiveProposal(web3: Web3Provider, proposal: Proposal);
  executeTransactions(web3: Web3Provider, proposal: Proposal);
  executeQueuedProposal(web3: Web3Provider, proposal: Proposal);
  vetoProposal(web3: Web3Provider, proposal: Proposal);
  setVotingDelay(web3: Web3Provider, space: Space, votingDelay: number);
  setMinVotingDuration(web3: Web3Provider, space: Space, minVotingDuration: number);
  setMaxVotingDuration(web3: Web3Provider, space: Space, maxVotingDuration: number);
  transferOwnership(web3: Web3Provider, space: Space, owner: string);
  delegate(web3: Web3Provider, space: Space, networkId: NetworkID, delegatee: string);
  send(envelope: any): Promise<any>;
};

export type NetworkApi = {
  loadProposalVotes(
    proposal: Proposal,
    paginationOpts: PaginationOpts,
    filter?: 'any' | 'for' | 'against' | 'abstain',
    sortBy?: 'vp-desc' | 'vp-asc' | 'created-desc' | 'created-asc'
  ): Promise<Vote[]>;
  loadUserVotes(voter: string): Promise<{ [key: string]: Vote }>;
  loadProposals(
    spaceId: string,
    paginationOpts: PaginationOpts,
    current: number,
    filter?: 'any' | 'active' | 'pending' | 'closed',
    searchQuery?: string
  ): Promise<Proposal[]>;
  loadProposal(
    spaceId: string,
    proposalId: number | string,
    current: number
  ): Promise<Proposal | null>;
  loadSpaces(paginationOpts: PaginationOpts, filter?: SpacesFilter): Promise<Space[]>;
  loadSpace(spaceId: string): Promise<Space | null>;
  loadUser(userId: string): Promise<User>;
};

export type NetworkHelpers = {
  pin: (content: any) => Promise<{ cid: string; provider: string }>;
  waitForTransaction(txId: string): Promise<any>;
  waitForSpace(spaceAddress: string, interval?: number): Promise<Space>;
  getExplorerUrl(id: string, type: 'transaction' | 'address' | 'contract' | 'token'): string;
};

type BaseNetwork = {
  name: string;
  avatar: string;
  currentUnit: 'block' | 'second';
  chainId: number | string;
  baseChainId: number;
  baseNetworkId?: NetworkID;
  hasReceive: boolean;
  supportsSimulation: boolean;
  managerConnectors: Connector[];
  api: NetworkApi;
  constants: {
    SUPPORTED_AUTHENTICATORS: { [key: string]: boolean };
    CONTRACT_SUPPORTED_AUTHENTICATORS: { [key: string]: boolean };
    SUPPORTED_STRATEGIES: { [key: string]: boolean };
    SUPPORTED_EXECUTORS: { [key: string]: boolean };
    RELAYER_AUTHENTICATORS: { [key: string]: 'evm' | 'evm-tx' | 'starknet' | undefined };
    AUTHS: { [key: string]: string };
    PROPOSAL_VALIDATIONS: { [key: string]: string };
    STRATEGIES: { [key: string]: string };
    EXECUTORS: { [key: string]: string };
    EDITOR_AUTHENTICATORS: StrategyTemplate[];
    EDITOR_PROPOSAL_VALIDATIONS: StrategyTemplate[];
    EDITOR_VOTING_STRATEGIES: StrategyTemplate[];
    EDITOR_EXECUTION_STRATEGIES: StrategyTemplate[];
  };
  helpers: NetworkHelpers;
};

export type ReadOnlyNetwork = BaseNetwork & { readOnly: true; actions: ReadOnlyNetworkActions };
export type ReadWriteNetwork = BaseNetwork & { readOnly?: false; actions: NetworkActions };
export type Network = ReadOnlyNetwork | ReadWriteNetwork;
