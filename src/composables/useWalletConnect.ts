import WalletConnect from '@walletconnect/client';
import { useStorage } from '@vueuse/core';
import { Fragment, JsonFragment, Interface } from '@ethersproject/abi';
import { ContractCallTransaction } from '@/types';
import { getABI } from '@/helpers/etherscan';
import { formatUnits } from '@ethersproject/units';
import { createContractCallTransaction } from '@/helpers/transactions';

const packagePrefix = 'sx-ui';
const storageId = `${packagePrefix}.walletconnect`;
let connector;

type ContractCallTransactionForm = {
  to: string;
  abi: (Fragment & JsonFragment)[];
  method: string;
  args: Record<string, any>;
  amount: string;
};

type TransactionCallback = (tx: ContractCallTransaction) => void;
const transactionCallbacks: TransactionCallback[] = [];
const onTransaction = (cb: TransactionCallback) => transactionCallbacks.push(cb);
const emitTransaction = (tx: ContractCallTransaction) => transactionCallbacks.forEach(cb => cb(tx));

async function adaptToContractCallTransactionForm(
  callParams: any
): Promise<ContractCallTransactionForm> {
  const abi = await getABI(callParams.to);

  const iface = new Interface(abi);
  const { name: methodName, args: functionArgs } = iface.parseTransaction({
    data: callParams.data
  });

  const [functionSignature] =
    Object.entries(iface.functions).find(([key, value]) => {
      return value.name === methodName && value.inputs.length === functionArgs.length;
    }) || [];

  if (!functionSignature) {
    throw new Error(
      `Could not find matching function for ${methodName} with ${functionArgs.length} arguments`
    );
  }

  return {
    to: callParams.to,
    abi,
    method: functionSignature,
    args: functionArgs,
    amount: formatUnits(callParams.value || 0)
  };
}

export function useWalletConnect({ wallet, network: chainId }) {
  const isAuthenticated = useStorage(`${packagePrefix}.isAuthenticated`, false);
  const wcBridge = useStorage(`${packagePrefix}.wcbridge`, '');

  const listenEvents = () => {
    connector.on('call_request', async (error, payload) => {
      if (error) throw error;

      if (payload.method !== 'eth_sendTransaction') {
        throw new Error(`Unsupported method for transaction: ${payload.method}`);
      }

      try {
        const txFormData: ContractCallTransactionForm = await adaptToContractCallTransactionForm(
          payload.params[0]
        );

        const tx: ContractCallTransaction = await createContractCallTransaction({
          form: txFormData
        });

        emitTransaction(tx);
      } catch (e) {
        console.error(e);
      }
    });

    connector.on('disconnect', () => {
      isAuthenticated.value = false;
      wcBridge.value = '';
    });
  };

  if (isAuthenticated.value && wcBridge.value) {
    connector = new WalletConnect({ storageId, bridge: wcBridge.value });

    if (!connector.connected) {
      isAuthenticated.value = false;
      wcBridge.value = '';
    }

    listenEvents();
  }

  async function logout() {
    if (!isAuthenticated.value) return;

    await connector.killSession();
    isAuthenticated.value = false;
    wcBridge.value = '';
  }

  async function connect(uri) {
    if (isAuthenticated.value) return;

    connector = new WalletConnect({ uri, storageId });
    connector.on('session_request', async error => {
      if (error) throw error;

      await connector.approveSession({
        accounts: [wallet],
        chainId
      });

      isAuthenticated.value = true;
      wcBridge.value = connector.bridge;
    });

    listenEvents();
  }

  return {
    connect,
    logout,
    isAuthenticated,
    onTransaction
  };
}
