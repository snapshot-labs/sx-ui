import { CallData, uint256 } from 'starknet';
import { utils, starknetNetworks } from '@snapshot-labs/sx';
import { getUrl, shorten } from '@/helpers/utils';
import { pinPineapple } from '@/helpers/pin';
import { StrategyConfig, StrategyTemplate } from '../types';

import IHCode from '~icons/heroicons-outline/code';
import IHCube from '~icons/heroicons-outline/cube';
import IHPencil from '~icons/heroicons-outline/pencil';
import IHLightningBolt from '~icons/heroicons-outline/lightning-bolt';
import { MAX_SYMBOL_LENGTH } from '@/helpers/constants';
import { NetworkID, StrategyParsedMetadata } from '@/types';

export function createConstants(networkId: NetworkID) {
  const config = starknetNetworks[networkId];
  if (!config) throw new Error(`Unsupported network ${networkId}`);

  const SUPPORTED_AUTHENTICATORS = {
    [config.Authenticators.EthSig]: true,
    [config.Authenticators.EthTx]: true,
    [config.Authenticators.StarkSig]: true,
    [config.Authenticators.StarkTx]: true
  };

  const CONTRACT_SUPPORTED_AUTHENTICATORS = {
    [config.Authenticators.EthTx]: true
  };

  const SUPPORTED_STRATEGIES = {
    [config.Strategies.MerkleWhitelist]: true,
    [config.Strategies.ERC20Votes]: true,
    [config.Strategies.EVMSlotValue]: true,
    [config.Strategies.OZVotesStorageProof]: true
  };

  const SUPPORTED_EXECUTORS = {};

  const RELAYER_AUTHENTICATORS = {
    [config.Authenticators.StarkSig]: 'starknet',
    [config.Authenticators.EthSig]: 'evm',
    [config.Authenticators.EthTx]: 'evm-tx'
  } as const;

  const AUTHS = {
    [config.Authenticators.EthSig]: 'Ethereum signature',
    [config.Authenticators.EthTx]: 'Ethereum transaction',
    [config.Authenticators.StarkSig]: 'Starknet signature',
    [config.Authenticators.StarkTx]: 'Starknet transaction'
  };

  const PROPOSAL_VALIDATIONS = {
    [config.ProposalValidations.VotingPower]: 'Voting power'
  };

  const STRATEGIES = {
    [config.Strategies.MerkleWhitelist]: 'Merkle whitelist',
    [config.Strategies.ERC20Votes]: 'ERC-20 Votes (EIP-5805)',
    [config.Strategies.EVMSlotValue]: 'EVM slot value',
    [config.Strategies.OZVotesStorageProof]: 'OZ Votes storage proof'
  };

  const EXECUTORS = {
    NoExecutionSimpleMajority: 'No execution simple majority',
    EthRelayer: 'Eth relayer'
  };

  const createSlotValueStrategyConfig = (
    address: string,
    name: string,
    about: string
  ): StrategyTemplate => ({
    address,
    name,
    about,
    icon: IHCode,
    generateSummary: (params: Record<string, any>) =>
      `(${shorten(params.contractAddress)}, ${params.slotIndex})`,
    generateParams: (params: Record<string, any>) => {
      return CallData.compile({
        contract_address: params.contractAddress,
        slot_index: uint256.bnToUint256(params.slotIndex)
      });
    },
    generateMetadata: async (params: Record<string, any>) => ({
      name,
      properties: {
        symbol: params.symbol,
        decimals: parseInt(params.decimals),
        token: params.contractAddress,
        payload: JSON.stringify({
          contractAddress: params.contractAddress,
          slotIndex: params.slotIndex
        })
      }
    }),
    parseParams: async (params: string, metadata: StrategyParsedMetadata | null) => {
      if (!metadata || !metadata.payload) throw new Error('Missing metadata');

      const [contractAddress] = params.split(',');
      const { slotIndex } = JSON.parse(metadata.payload);

      return {
        contractAddress,
        decimals: metadata.decimals,
        symbol: metadata.symbol,
        slotIndex
      };
    },
    paramsDefinition: {
      type: 'object',
      title: 'Params',
      additionalProperties: false,
      required: ['contractAddress', 'slotIndex'],
      properties: {
        contractAddress: {
          type: 'string',
          format: 'address',
          title: 'Contract address',
          examples: ['0x0000…']
        },
        slotIndex: {
          type: 'integer',
          title: 'Slot index',
          examples: ['0']
        },
        decimals: {
          type: 'integer',
          title: 'Decimals',
          examples: ['18']
        },
        symbol: {
          type: 'string',
          maxLength: MAX_SYMBOL_LENGTH,
          title: 'Symbol',
          examples: ['e.g. COMP']
        }
      }
    }
  });

  const EDITOR_AUTHENTICATORS = [
    {
      address: config.Authenticators.StarkTx,
      name: 'Starknet transaction',
      about:
        'Will authenticate a user by checking if the caller address corresponds to the author or voter address.',
      icon: IHCube,
      paramsDefinition: null
    },
    {
      address: config.Authenticators.StarkSig,
      name: 'Starknet signature',
      about:
        'Will authenticate a user based on an EIP-712 message signed by a Starknet private key.',
      icon: IHPencil,
      paramsDefinition: null
    },
    {
      address: config.Authenticators.EthTx,
      name: 'Ethereum transaction',
      about:
        'Will authenticate a user by checking if the caller address of Ethereum transaction corresponds to the author or voter address.',
      icon: IHCube,
      paramsDefinition: null
    },
    {
      address: config.Authenticators.EthSig,
      name: 'Ethereum signature',
      about:
        'Will authenticate a user based on an EIP-712 message signed by an Ethereum private key.',
      icon: IHPencil,
      paramsDefinition: null
    }
  ];

  const EDITOR_PROPOSAL_VALIDATIONS = [
    {
      address: config.ProposalValidations.VotingPower,
      type: 'VotingPower',
      name: 'Voting power',
      icon: IHLightningBolt,
      validate: (params: Record<string, any>) => {
        return params?.strategies?.length > 0;
      },
      generateSummary: (params: Record<string, any>) => `(${params.threshold})`,
      generateParams: (params: Record<string, any>) => {
        const strategies = params.strategies.map((strategy: StrategyConfig) => {
          return {
            address: strategy.address,
            params: strategy.generateParams ? strategy.generateParams(strategy.params) : []
          };
        });

        return CallData.compile({
          threshold: uint256.bnToUint256(params.threshold),
          allowed_strategies: strategies
        });
      },
      generateMetadata: async (params: Record<string, any>) => {
        const strategiesMetadata = await Promise.all(
          params.strategies.map(async (strategy: StrategyConfig) => {
            if (!strategy.generateMetadata) return;

            const metadata = await strategy.generateMetadata(strategy.params);
            const pinned = await pinPineapple(metadata);

            return `ipfs://${pinned.cid}`;
          })
        );

        return {
          strategies_metadata: strategiesMetadata
        };
      },
      parseParams: async (params: string) => {
        const [low, high] = params.split(',');

        return {
          threshold: uint256.uint256ToBN({ low, high }).toString(10)
        };
      },
      paramsDefinition: {
        type: 'object',
        title: 'Params',
        additionalProperties: false,
        required: ['threshold'],
        properties: {
          threshold: {
            type: 'integer',
            title: 'Proposal threshold',
            examples: ['1']
          }
        }
      }
    }
  ];

  const EDITOR_VOTING_STRATEGIES = [
    {
      address: config.Strategies.MerkleWhitelist,
      name: 'Whitelist',
      about:
        'A strategy that defines a list of addresses each with designated voting power, using a Merkle tree for verification.',
      generateSummary: (params: Record<string, any>) => {
        const length =
          params.whitelist.trim().length === 0 ? 0 : params.whitelist.split('\n').length;

        return `(${length} ${length === 1 ? 'address' : 'addresses'})`;
      },
      generateParams: (params: Record<string, any>) => {
        const leaves = params.whitelist.split('\n').map((item: string) => {
          const [address, votingPower] = item.split(':');
          const type =
            address.length === 42
              ? utils.merkle.AddressType.ETHEREUM
              : utils.merkle.AddressType.STARKNET;

          return new utils.merkle.Leaf(type, address, BigInt(votingPower));
        });

        return [
          utils.merkle.generateMerkleRoot(leaves.map((leaf: utils.merkle.Leaf) => leaf.hash))
        ];
      },
      generateMetadata: async (params: Record<string, any>) => {
        const tree = params.whitelist.split('\n').map((item: string) => {
          const [address, votingPower] = item.split(':');
          const type = address.length === 42 ? 1 : 0;

          return {
            type,
            address,
            votingPower: votingPower
          };
        });

        const pinned = await pinPineapple({ tree });

        return {
          name: 'Whitelist',
          properties: {
            symbol: params.symbol,
            decimals: 0,
            payload: `ipfs://${pinned.cid}`
          }
        };
      },
      parseParams: async (params: string, metadata: StrategyParsedMetadata | null) => {
        if (!metadata) throw new Error('Missing metadata');

        const getWhitelist = async (payload: string) => {
          const metadataUrl = getUrl(payload);

          if (!metadataUrl) return '';

          const res = await fetch(metadataUrl);
          const { tree } = await res.json();
          return tree.map((item: any) => `${item.address}:${item.votingPower}`).join('\n');
        };

        return {
          symbol: metadata.symbol,
          whitelist: metadata.payload ? await getWhitelist(metadata.payload) : ''
        };
      },
      paramsDefinition: {
        type: 'object',
        title: 'Params',
        additionalProperties: false,
        required: [],
        properties: {
          whitelist: {
            type: 'string',
            format: 'long',
            title: 'Whitelist',
            examples: ['0x556B14CbdA79A36dC33FcD461a04A5BCb5dC2A70:40']
          },
          symbol: {
            type: 'string',
            maxLength: MAX_SYMBOL_LENGTH,
            title: 'Symbol',
            examples: ['e.g. VP']
          }
        }
      }
    },
    {
      address: config.Strategies.ERC20Votes,
      name: 'ERC-20 Votes (EIP-5805)',
      about:
        'A strategy that allows delegated balances of OpenZeppelin style checkpoint tokens to be used as voting power.',
      icon: IHCode,
      generateSummary: (params: Record<string, any>) =>
        `(${shorten(params.contractAddress)}, ${params.decimals})`,
      generateParams: (params: Record<string, any>) => [params.contractAddress],
      generateMetadata: async (params: Record<string, any>) => ({
        name: 'ERC-20 Votes (EIP-5805)',
        properties: {
          symbol: params.symbol,
          decimals: parseInt(params.decimals),
          token: params.contractAddress
        }
      }),
      parseParams: async (params: string, metadata: StrategyParsedMetadata | null) => {
        if (!metadata) throw new Error('Missing metadata');

        return {
          contractAddress: metadata.token,
          decimals: metadata.decimals,
          symbol: metadata.symbol
        };
      },
      paramsDefinition: {
        type: 'object',
        title: 'Params',
        additionalProperties: false,
        required: ['contractAddress', 'decimals'],
        properties: {
          contractAddress: {
            type: 'string',
            format: 'address',
            title: 'Token address',
            examples: ['0x0000…']
          },
          decimals: {
            type: 'integer',
            title: 'Decimals',
            examples: ['18']
          },
          symbol: {
            type: 'string',
            maxLength: MAX_SYMBOL_LENGTH,
            title: 'Symbol',
            examples: ['e.g. UNI']
          }
        }
      }
    },
    ...(config.Strategies.EVMSlotValue
      ? [
          createSlotValueStrategyConfig(
            config.Strategies.EVMSlotValue,
            'EVM slot value',
            'A strategy that allows to use the value of an slot on EVM chain (for example ERC-20 balance on L1) as voting power.'
          )
        ]
      : []),
    ...(config.Strategies.OZVotesStorageProof
      ? [
          createSlotValueStrategyConfig(
            config.Strategies.OZVotesStorageProof,
            'OZ Votes storage proof',
            'A strategy that allows to use the value of an slot on EVM chain (for example ERC-20 balance on L1) as voting power including delegated balances.'
          )
        ]
      : [])
  ];

  const EDITOR_PROPOSAL_VALIDATION_VOTING_STRATEGIES = EDITOR_VOTING_STRATEGIES.filter(
    strategy =>
      ![config.Strategies.EVMSlotValue, config.Strategies.OZVotesStorageProof].includes(
        strategy.address
      )
  );

  const EDITOR_EXECUTION_STRATEGIES = [
    {
      address: config.ExecutionStrategies.NoExecutionSimpleMajority,
      type: 'NoExecutionSimpleMajority',
      name: EXECUTORS.NoExecutionSimpleMajority,
      paramsDefinition: null
    }
  ];

  return {
    SUPPORTED_AUTHENTICATORS,
    CONTRACT_SUPPORTED_AUTHENTICATORS,
    SUPPORTED_STRATEGIES,
    SUPPORTED_EXECUTORS,
    RELAYER_AUTHENTICATORS,
    AUTHS,
    PROPOSAL_VALIDATIONS,
    STRATEGIES,
    EXECUTORS,
    EDITOR_AUTHENTICATORS,
    EDITOR_PROPOSAL_VALIDATIONS,
    EDITOR_VOTING_STRATEGIES,
    EDITOR_PROPOSAL_VALIDATION_VOTING_STRATEGIES,
    EDITOR_EXECUTION_STRATEGIES
  };
}
