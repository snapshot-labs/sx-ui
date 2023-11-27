import { useAccount, useConnect, useDisconnect, useNetwork } from 'use-wagmi';
import { getWalletClient } from '@wagmi/core';
import { Web3Provider } from '@ethersproject/providers';
import { mainnet, goerli } from 'viem/chains';
import { computedAsync } from '@vueuse/core';

const defaultChainId: any = import.meta.env.VITE_DEFAULT_NETWORK;

export function useWeb3() {
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected, isConnecting, connector, isReconnecting } = useAccount();
  const { chain } = useNetwork();

  const connectorId = computed(() => connector.value?.id ?? '');
  const defaultChain = computed(() => (defaultChainId === '1' ? mainnet : goerli));

  const web3WalletClient = computedAsync<any>(async () => {
    const walletClient = await getWalletClient();
    if (walletClient) {
      const network =
        connectorId.value !== 'argentx' && chain?.value
          ? {
              chainId: chain.value.id,
              name: chain.value.name,
              ensAddress: chain.value.contracts?.ensRegistry?.address
            }
          : undefined;

      const web3Client = new Web3Provider(walletClient?.transport, network);

      if (web3Client) return web3Client;
    }
    return null;
  });

  return {
    connect,
    disconnect,
    chain: computed(() => chain?.value ?? defaultChain.value),
    web3Account: computed(() => address.value ?? ''),
    isConnected,
    isConnecting,
    isReconnecting,
    web3WalletClient,
    connectorId
  };
}
