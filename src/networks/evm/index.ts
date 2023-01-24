import { createApi } from '../common/graphqlApi';
import { createActions } from './actions';
import { createProvider } from './provider';
import * as constants from './constants';
import type { Network } from '@/networks/types';

export function createEvmNetwork(): Network {
  const provider = createProvider('https://rpc.brovider.xyz/5');

  return {
    hasRelayer: false,
    hasReceive: false,
    actions: createActions(),
    api: createApi(constants.API_URL),
    constants,
    helpers: {
      waitForTransaction: txId => provider.waitForTransaction(txId),
      getTransactionLink: txId => `https://goerli.etherscan.io/tx/${txId}`
    }
  };
}
