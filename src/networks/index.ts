import { createStarknetNetwork } from './starknet';
import { createEvmNetwork } from './evm';
import type { NetworkID } from '@/types';

const starknetNetwork = createStarknetNetwork('sn-tn2');
const evmNetwork = createEvmNetwork('goe');

export const enabledNetworks: NetworkID[] = ['goe', 'sn-tn2'];

export const getNetwork = (id: NetworkID) => {
  if (id === 'goe') return evmNetwork;
  if (id === 'sn-tn2') return starknetNetwork;

  throw new Error(`Unknown network ${id}`);
};

export const currentNetwork = evmNetwork;

export { createStarknetNetwork, createEvmNetwork };
