import { Core } from '@walletconnect/core';
import { Web3Wallet } from '@walletconnect/web3wallet';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { ProposalTypes, SessionTypes } from '@walletconnect/types';
import { Interface } from '@ethersproject/abi';
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { createContractCallTransaction } from '@/helpers/transactions';
import { getABI } from '@/helpers/etherscan';
import { Transaction } from '@/types';

type ApproveCallback = (proposal: ProposalTypes.Struct) => Promise<boolean>;
type IncomingTransactionCallback = (transaction: Transaction) => any;

const projectId = import.meta.env.VITE_WC_PROJECT_ID;
const core = new Core({
  projectId
});
const connector = await Web3Wallet.init({
  core,
  metadata: {
    name: 'Snapshot X',
    description: 'Snapshot X',
    url: 'https://snapshotx.org/',
    icons: []
  }
});

const logged = ref(false);
const loading = ref(false);

async function parseCall(call) {
  const params = call.params[0];

  const abi = await getABI(params.to);
  const iface = new Interface(abi);
  const tx = iface.parseTransaction(params);

  const abiFunction = iface.getFunction(tx.signature);

  const args = Object.fromEntries(
    abiFunction.inputs.map(input => {
      const rawValue = tx.args[input.name];
      let value = rawValue;
      if (BigNumber.isBigNumber(rawValue)) {
        value = rawValue.toString();
      } else if (Array.isArray(rawValue)) {
        value = rawValue.join(', ');
      }

      return [input.name, value];
    })
  );

  return createContractCallTransaction({
    form: {
      to: params.to,
      abi,
      method: tx.signature,
      amount: formatUnits(params.value || 0),
      args
    }
  });
}

export function useWalletConnect() {
  const session: Ref<SessionTypes.Struct | null> = ref(null);
  const requests = ref([]) as Ref<any[]>;

  async function logout() {
    if (!session.value) return;

    await connector.disconnectSession({
      topic: session.value.topic,
      reason: getSdkError('USER_DISCONNECTED')
    });

    session.value = null;
    logged.value = false;
  }

  async function connect(
    chainId: number,
    account: string,
    uri: string,
    approveCallback: ApproveCallback,
    incomingTransactionCallback: IncomingTransactionCallback
  ) {
    loading.value = true;

    if (logged.value) await logout();
    await connector.core.pairing.pair({ uri });

    connector.on('session_proposal', async ({ id, params }) => {
      const approved = await approveCallback(params);
      if (!approved) {
        loading.value = false;

        return connector.rejectSession({
          id,
          reason: getSdkError('USER_REJECTED')
        });
      }

      const approvedNamespaces = buildApprovedNamespaces({
        proposal: params,
        supportedNamespaces: {
          eip155: {
            chains: [`eip155:${chainId}`],
            methods: ['eth_sendTransaction', 'personal_sign'],
            events: ['accountsChanged', 'chainChanged'],
            accounts: [`eip155:${chainId}:${account}`]
          }
        }
      });

      session.value = await connector.approveSession({ id, namespaces: approvedNamespaces });
      logged.value = true;
      loading.value = false;
    });

    connector.on('session_request', async payload => {
      console.log('payload', payload);

      const { request } = payload.params;
      if (request.method !== 'eth_sendTransaction') return;

      try {
        const transaction = await parseCall(request);
        incomingTransactionCallback(transaction);
        logout();
      } catch (e) {
        console.error(e);
      }
    });

    connector.on('session_delete', () => {
      loading.value = false;
      logged.value = false;
    });
  }

  return {
    parseCall,
    connect,
    logout,
    loading,
    logged,
    requests
  };
}
