import { createApi } from '../common/graphqlApi';
import { createActions } from './actions';
import { createProvider } from './provider';
import * as constants from './constants';
import type { Network } from '@/networks/types';

export function createStarknetNetwork(): Network {
  const provider = createProvider();

  return {
    hasRelayer: true,
    hasReceive: true,
    actions: createActions(provider),
    api: createApi(constants.API_URL),
    constants,
    helpers: {
      waitForTransaction: txId => provider.waitForTransaction(txId),
      getTransactionLink: txId => `https://testnet-2.starkscan.co/tx/${txId}`
    }
  };
}
