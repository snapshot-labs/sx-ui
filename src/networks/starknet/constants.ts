import { CallData, uint256 } from 'starknet';
import { StrategyConfig } from '../types';

import IHLightningBolt from '~icons/heroicons-outline/lightning-bolt';

export const API_URL = 'http://localhost:3000';

export const SUPPORTED_AUTHENTICATORS = {
  '0x6c363a572f7f86b58fff89abf6f924cb75e97a92af2b2acbdd0156ddd18761d': true
};

export const SUPPORTED_STRATEGIES = {
  '0x4ad4a117a2b047fc3e25bf52791bc8f29a0871ac3c41a3e176f18c8a1087815': true
};

export const SUPPORTED_EXECUTORS = {};

export const RELAYER_AUTHENTICATORS = {};

export const AUTHS = {
  '0x6c363a572f7f86b58fff89abf6f924cb75e97a92af2b2acbdd0156ddd18761d': 'Vanilla',
  '0x7626ea056115e0dbb6b098e6a1fa0b9978b6b0a3d3936aad95b96d477fad09': 'Ethereum signature',
  '0x2c27791b44910c295e3fadaa4d3a9b095cefb5554f885f2362c40209978555': 'Ethereum transaction',
  '0x256cd338bb24decbfaf05366b540c2b0fb9c504475d4b3baba01e6975cf2a6e': 'Starknet signature',
  '0x52a8c751db001ed116d2194521331426910cd800a656d57b575929e1058b35b': 'Starknet transaction'
};

export const PROPOSAL_VALIDATIONS = {
  '0x78a2ddc7e001ce3f5f588ce023f7a148890d5ef6e99da1b5e3314b95a5de773': 'Voting power'
};

export const STRATEGIES = {
  '0x4ad4a117a2b047fc3e25bf52791bc8f29a0871ac3c41a3e176f18c8a1087815': 'Vanilla',
  '0xbb521a991e80fb81e39d8f0d463db2a9cf843316960f1edfce6e6c0109eade': 'Merkle whitelist',
  '0x2581d59cc3961ea2db43e7fca258823c01165b1455e91d4186255e14f7d540a': 'Delegated ERC20 Token'
};

export const EXECUTORS = {
  SimpleQuorumVanilla: 'Vanilla',
  EthRelayer: 'Eth relayer'
};

export const EDITOR_AUTHENTICATORS = [
  {
    address: '0x6c363a572f7f86b58fff89abf6f924cb75e97a92af2b2acbdd0156ddd18761d',
    name: 'Vanilla',
    paramsDefinition: null
  }
];

export const EDITOR_PROPOSAL_VALIDATIONS = [
  {
    address: '0x78a2ddc7e001ce3f5f588ce023f7a148890d5ef6e99da1b5e3314b95a5de773',
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

export const EDITOR_VOTING_STRATEGIES = [
  {
    address: '0x4ad4a117a2b047fc3e25bf52791bc8f29a0871ac3c41a3e176f18c8a1087815',
    name: 'Vanilla',
    about:
      'A strategy that gives one voting power to anyone. It should only be used for testing purposes and not in production.',
    generateMetadata: (params: Record<string, any>) => ({
      name: 'Vanilla',
      properties: {
        symbol: params.symbol,
        decimals: 0
      }
    }),
    paramsDefinition: {
      type: 'object',
      title: 'Params',
      additionalProperties: false,
      required: [],
      properties: {
        symbol: {
          type: 'string',
          maxLength: 6,
          title: 'Symbol',
          examples: ['e.g. VP']
        }
      }
    }
  }
];

export const EDITOR_EXECUTION_STRATEGIES = [
  {
    address: '0x11e23c970f91aaedc3be30431377d2b46fafed2107fe49ba061eff0ba1d41a',
    type: 'SimpleQuorumVanilla',
    name: 'Vanilla',
    paramsDefinition: null
  }
];
