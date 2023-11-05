import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useEnsAddress,
  Config
} from 'use-wagmi';
import { Web3Provider } from '@ethersproject/providers';
import { mainnet, goerli } from 'viem/chains';

const defaultChainId: any = import.meta.env.VITE_DEFAULT_NETWORK;

const web3ProviderRef = ref<any>(null);
const providerRef = ref<any>(null);
const connectorIdRef = ref<any>('');

export function useWeb3() {
  const uiStore = useUiStore();

  const { connect } = useConnect({
    onSuccess({ connector }) {
      initProviders(connector);
      connectorIdRef.value = connector?.id ?? '';
    },
    onError(e) {
      uiStore.addNotification('error', e.message);
    }
  });
  const { disconnect } = useDisconnect();
  const { address, isConnected, isConnecting } = useAccount({
    // TODO: Fix onConnect so we can use auto connect https://github.com/unicape/use-wagmi/issues/82
    // onConnect({ connector }) {
    //   console.log('🚀 ~ file: useWeb3.ts:33 ~ onConnect ~ connector?.id:', connector?.id);
    // }
  });
  const { chain } = useNetwork();
  const { data: ensAddress } = useEnsAddress();

  const defaultChain = computed(() => (defaultChainId === '1' ? mainnet : goerli));

  async function initProviders(connector: Config['connector']) {
    const provider = await connector?.getProvider();
    if (provider) {
      providerRef.value = provider;
      web3ProviderRef.value = new Web3Provider(provider);
    } else {
      providerRef.value = null;
      web3ProviderRef.value = null;
    }
  }

  return {
    connect,
    disconnect,
    chain: computed(() => chain?.value ?? defaultChain.value),
    web3Account: computed(() => address.value ?? ''),
    ensAddress: computed(() => ensAddress.value ?? ''),
    isConnected,
    isConnecting,
    web3ProviderRef,
    providerRef,
    connectorIdRef
  };
}
