import { useAccount, useConnect, useDisconnect, useNetwork } from 'use-wagmi';
import { getWalletClient } from '@wagmi/core';
import { Web3Provider } from '@ethersproject/providers';
import { mainnet, goerli } from 'viem/chains';

const defaultChainId: any = import.meta.env.VITE_DEFAULT_NETWORK;

export function useWeb3() {
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected, isConnecting, connector, isReconnecting } = useAccount();
  const { chain } = useNetwork();

  const web3WalletClient = ref();

  const connectorId = computed(() => connector.value?.id ?? '');
  const defaultChain = computed(() => (defaultChainId === '1' ? mainnet : goerli));

  async function initWeb3WalletClient() {
    const walletClient = await getWalletClient();

    if (chain?.value && walletClient) {
      const network =
        connectorId.value !== 'argentx'
          ? {
              chainId: chain.value.id,
              name: chain.value.name,
              ensAddress: chain.value.contracts?.ensRegistry?.address
            }
          : undefined;

      const web3Client = new Web3Provider(walletClient?.transport, network);

      if (web3Client) web3WalletClient.value = web3Client;
    }
    web3WalletClient.value = undefined;
  }

  return {
    connect,
    disconnect,
    initWeb3WalletClient,
    chain: computed(() => chain?.value ?? defaultChain.value),
    web3Account: computed(() => address.value ?? ''),
    isConnected,
    isConnecting,
    isReconnecting,
    web3WalletClient,
    connectorId
  };
}
