import { getInstance } from '@snapshot-labs/lock/plugins/vue3';
import client from '@/helpers/client';
import { set } from '@/helpers/ipfs';
import { useWeb3 } from '@/composables/useWeb3';
import { useTxStatus } from '@/composables/useTxStatus';
import { useAccount } from '@/composables/useAccount';

export function useActions() {
  const { web3 } = useWeb3();
  const auth = getInstance();
  const { pendingCount } = useTxStatus();
  const { loadVotes } = useAccount();

  async function vote(space: string, proposal: number, choice: number) {
    const envelop = await client.vote(auth.web3, web3.value.account, {
      space,
      proposal,
      choice
    });
    console.log('Envelop', envelop);
    pendingCount.value++;
    const receipt = await client.send(envelop);
    pendingCount.value--;
    console.log('Receipt', receipt);
    await loadVotes();
  }

  async function propose(
    space: string,
    executionHash: string,
    title: string,
    body: string,
    discussion: string
  ) {
    const ipfsHash = await set({ title, body, discussion });
    console.log('IPFS hash', ipfsHash);
    const envelop = await client.propose(auth.web3, web3.value.account, {
      space,
      executionHash,
      metadataURI: `ipfs://${ipfsHash}`
    });
    console.log('Envelop', envelop);
    pendingCount.value++;
    const receipt = await client.send(envelop);
    pendingCount.value--;
    console.log('Receipt', receipt);
  }

  return {
    vote,
    propose
  };
}