import { getInstance } from '@snapshot-labs/lock/plugins/vue3';
import { getNetwork } from '@/networks';
import { useUiStore } from '@/stores/ui';
import { useWeb3 } from '@/composables/useWeb3';
import { useModal } from '@/composables/useModal';
import type { Transaction, Proposal, SpaceMetadata, Space, Choice, NetworkID } from '@/types';

export function useActions() {
  const uiStore = useUiStore();
  const { web3 } = useWeb3();
  const { modalAccountOpen } = useModal();
  const auth = getInstance();

  async function wrapPromise(networkId: NetworkID, promise: Promise<any>) {
    const network = getNetwork(networkId);

    const envelope = await promise;
    console.log('envelope', envelope);

    // TODO: unify send/soc to both return txHash under same property
    if (network.hasRelayer) {
      const receipt = await network.actions.send(envelope);

      console.log('Receipt', receipt);
      uiStore.addPendingTransaction(receipt.transaction_hash, networkId);
    } else {
      uiStore.addPendingTransaction(envelope.hash, networkId);
    }
  }

  async function forceLogin() {
    modalAccountOpen.value = true;
  }

  async function updateMetadata(space: Space, metadata: SpaceMetadata) {
    if (!web3.value.account) return await forceLogin();
    if (web3.value.type === 'argentx') throw new Error('ArgentX is not supported');

    const network = getNetwork(space.network);

    const pinned = await network.helpers.pin(metadata);

    const receipt = await network.actions.setMetadataUri(
      auth.web3,
      space.id,
      `ipfs://${pinned.cid}`
    );

    console.log('Receipt', receipt);
    uiStore.addPendingTransaction(
      network.hasRelayer ? receipt.transaction_hash : receipt.hash,
      space.network
    );
  }

  async function vote(proposal: Proposal, choice: Choice) {
    if (!web3.value.account) return await forceLogin();
    if (web3.value.type === 'argentx') throw new Error('ArgentX is not supported');

    const network = getNetwork(proposal.network);

    await wrapPromise(
      proposal.network,
      network.actions.vote(auth.web3, web3.value.account, proposal, choice)
    );
  }

  async function propose(
    space: Space,
    title: string,
    body: string,
    discussion: string,
    execution: Transaction[]
  ) {
    if (!web3.value.account) return await forceLogin();
    if (web3.value.type === 'argentx') throw new Error('ArgentX is not supported');

    const network = getNetwork(space.network);

    const transactions = execution.map((tx: Transaction) => ({
      ...tx,
      nonce: 0,
      operation: 0
    }));

    const pinned = await network.helpers.pin({
      title,
      body,
      discussion,
      execution: transactions
    });
    if (!pinned || !pinned.cid) return;
    console.log('IPFS', pinned);

    await wrapPromise(
      space.network,
      network.actions.propose(auth.web3, web3.value.account, space, pinned.cid, transactions)
    );
  }

  async function finalizeProposal(proposal: Proposal) {
    if (!web3.value.account) return await forceLogin();
    if (web3.value.type === 'argentx') throw new Error('ArgentX is not supported');

    const network = getNetwork(proposal.network);

    const receipt = await network.actions.finalizeProposal(auth.web3, proposal);

    console.log('Receipt', receipt);
    uiStore.addPendingTransaction(
      network.hasRelayer ? receipt.transaction_hash : receipt.hash,
      proposal.network
    );
  }

  async function receiveProposal(proposal: Proposal) {
    if (!web3.value.account) return await forceLogin();
    if (web3.value.type === 'argentx') throw new Error('ArgentX is not supported');

    const network = getNetwork(proposal.network);
    if (!network.hasReceive) throw new Error('Receive on this network is not supported');

    const receipt = await network.actions.receiveProposal(auth.web3, proposal);
    console.log('Receipt', receipt);
  }

  async function executeTransactions(proposal: Proposal) {
    if (!web3.value.account) return await forceLogin();
    if (web3.value.type === 'argentx') throw new Error('ArgentX is not supported');

    const network = getNetwork(proposal.network);

    const receipt = await network.actions.executeTransactions(auth.web3, proposal);
    console.log('Receipt', receipt);
  }

  return {
    updateMetadata,
    vote,
    propose,
    finalizeProposal,
    receiveProposal,
    executeTransactions
  };
}
