import { Provider } from '@ethersproject/providers';
import { clients, getEvmStrategy, evmGoerli } from '@snapshot-labs/sx';
import { createErc1155Metadata, verifyNetwork } from '@/helpers/utils';
import { convertToMetaTransactions } from '@/helpers/transactions';
import { getExecution, pickAuthenticatorAndStrategies } from './helpers';
import type { Web3Provider } from '@ethersproject/providers';
import type { NetworkActions, NetworkHelpers, StrategyConfig, VotingPower } from '@/networks/types';
import type { MetaTransaction } from '@snapshot-labs/sx/dist/utils/encoding/execution-hash';
import type { Space, Proposal, SpaceMetadata } from '@/types';

type Choice = 0 | 1 | 2;

export function createActions(
  provider: Provider,
  helpers: NetworkHelpers,
  chainId: number
): NetworkActions {
  const manaUrl: string = import.meta.env.VITE_MANA_URL || 'http://localhost:3000';

  const client = new clients.EvmEthereumTx();
  const ethSigClient = new clients.EvmEthereumSig({
    manaUrl
  });

  return {
    async predictSpaceAddress(web3: Web3Provider, { salt }) {
      return client.predictSpaceAddress({ signer: web3.getSigner(), salt });
    },
    deployDependency(
      web3: Web3Provider,
      params: {
        controller: string;
        spaceAddress: string;
        strategy: StrategyConfig;
      }
    ) {
      if (!params.strategy.deploy) {
        throw new Error('This strategy is not deployable');
      }

      return params.strategy.deploy(
        client,
        web3.getSigner(),
        params.controller,
        params.spaceAddress,
        params.strategy.params
      );
    },
    async createSpace(
      web3: any,
      salt: string,
      params: {
        controller: string;
        votingDelay: number;
        minVotingDuration: number;
        maxVotingDuration: number;
        proposalThreshold: bigint;
        quorum: bigint;
        authenticators: StrategyConfig[];
        validationStrategy: StrategyConfig;
        votingStrategies: StrategyConfig[];
        executionStrategies: StrategyConfig[];
        metadata: SpaceMetadata;
      }
    ) {
      await verifyNetwork(web3, chainId);

      const pinned = await helpers.pin(
        createErc1155Metadata(params.metadata, {
          executionStrategies: params.executionStrategies.map(config => config.address)
        })
      );

      const response = await client.deploySpace({
        signer: web3.getSigner(),
        salt,
        params: {
          ...params,
          authenticators: params.authenticators.map(config => config.address),
          votingStrategies: params.votingStrategies.map(config => ({
            addy: config.address,
            params: config.generateParams ? config.generateParams(config.params)[0] : '0x'
          })),
          votingStrategiesMetadata: params.votingStrategies.map(config =>
            config.generateMetadata ? config.generateMetadata(config.params) : '0x00'
          ),
          proposalValidationStrategy: {
            addy: params.validationStrategy.address,
            params: params.validationStrategy.generateParams
              ? params.validationStrategy.generateParams(params.validationStrategy.params)[0]
              : '0x'
          },
          metadataUri: `ipfs://${pinned.cid}`
        }
      });

      return { hash: response.txId };
    },
    setMetadata: async (web3: Web3Provider, space: Space, metadata: SpaceMetadata) => {
      await verifyNetwork(web3, chainId);

      const pinned = await helpers.pin(
        createErc1155Metadata(metadata, {
          executionStrategies: space.executors
        })
      );

      return client.setMetadataUri({
        signer: web3.getSigner(),
        space: space.id,
        metadataUri: `ipfs://${pinned.cid}`
      });
    },
    propose: async (
      web3: Web3Provider,
      account: string,
      space: Space,
      cid: string,
      transactions: MetaTransaction[]
    ) => {
      await verifyNetwork(web3, chainId);

      const { useRelayer, authenticator, strategies } = pickAuthenticatorAndStrategies(
        space.authenticators,
        space.voting_power_validation_strategy_strategies
      );

      const { executor, executionData } = getExecution(space, transactions);

      const data = {
        space: space.id,
        authenticator,
        strategies,
        executionStrategy: {
          addy: executor,
          params: executionData.executionParams[0]
        },
        metadataUri: `ipfs://${cid}`
      };

      if (useRelayer) {
        return ethSigClient.propose({
          signer: web3.getSigner(),
          data
        });
      }

      return client.propose({
        signer: web3.getSigner(),
        envelope: {
          data
        }
      });
    },
    vote: async (web3: Web3Provider, account: string, proposal: Proposal, choice: number) => {
      await verifyNetwork(web3, chainId);

      if (choice < 1 || choice > 3) throw new Error('Invalid chocie');

      const { useRelayer, authenticator, strategies } = pickAuthenticatorAndStrategies(
        proposal.space.authenticators,
        proposal.strategies
      );

      let convertedChoice: Choice = 0;
      if (choice === 1) convertedChoice = 1;
      if (choice === 2) convertedChoice = 0;
      if (choice === 3) convertedChoice = 2;

      const data = {
        space: proposal.space.id,
        authenticator,
        strategies,
        proposal: proposal.proposal_id,
        choice: convertedChoice,
        metadataUri: ''
      };

      if (useRelayer) {
        return ethSigClient.vote({
          signer: web3.getSigner(),
          data
        });
      }

      return client.vote({
        signer: web3.getSigner(),
        envelope: {
          data
        }
      });
    },
    finalizeProposal: () => null,
    receiveProposal: () => null,
    executeTransactions: async (web3: Web3Provider, proposal: Proposal) => {
      await verifyNetwork(web3, chainId);

      const { executionData } = getExecution(
        proposal.space,
        convertToMetaTransactions(proposal.execution)
      );

      return client.execute({
        signer: web3.getSigner(),
        space: proposal.space.id,
        proposal: proposal.proposal_id,
        executionParams: executionData.executionParams[0]
      });
    },
    executeQueuedProposal: async (web3: Web3Provider, proposal: Proposal) => {
      await verifyNetwork(web3, chainId);

      const { executor, executionData } = getExecution(
        proposal.space,
        convertToMetaTransactions(proposal.execution)
      );

      return client.executeQueuedProposal({
        signer: web3.getSigner(),
        executionStrategy: executor,
        executionParams: executionData.executionParams[0]
      });
    },
    send: (envelope: any) => ethSigClient.send(envelope),
    getVotingPower: async (
      strategiesAddresses: string[],
      strategiesParams: any[],
      strategiesMetadata: string[],
      voterAddress: string,
      timestamp: number
    ): Promise<VotingPower[]> => {
      return Promise.all(
        strategiesAddresses.map(async (address, i) => {
          const strategy = getEvmStrategy(address, evmGoerli);
          if (!strategy) return { address, value: 0n, decimals: 0 };

          const value = await strategy.getVotingPower(
            address,
            voterAddress,
            timestamp,
            strategiesParams[i],
            provider
          );

          const token = strategy.type === 'comp' ? strategiesParams[i] : undefined;
          return {
            address,
            value,
            decimals: strategiesMetadata[i] ? parseInt(strategiesMetadata[i], 16) : 0,
            token
          };
        })
      );
    }
  };
}
