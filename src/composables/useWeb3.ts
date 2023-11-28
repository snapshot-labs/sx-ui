import { useAccount, useNetwork } from 'use-wagmi';
import { getWalletClient } from '@wagmi/core';
import { Web3Provider } from '@ethersproject/providers';
import { mainnet, goerli } from 'viem/chains';

const defaultChainId: any = import.meta.env.VITE_DEFAULT_NETWORK;

export function useWeb3() {
  const { address, connector } = useAccount();
  const { chain } = useNetwork();

  const web3WalletClient = ref();

  const connectorId = computed(() => connector.value?.id ?? '');
  const defaultChain = computed(() => (defaultChainId === '1' ? mainnet : goerli));

  async function initWeb3WalletClient() {
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

      if (web3Client) web3WalletClient.value = web3Client;
    }
    web3WalletClient.value = undefined;
  }

  return {
    initWeb3WalletClient,
    chain: computed(() => chain?.value ?? defaultChain.value),
    web3Account: computed(() => address.value ?? ''),
    connectorId: computed(() => connectorId.value),
    web3WalletClient: computed(() => web3WalletClient.value)
  };
}
