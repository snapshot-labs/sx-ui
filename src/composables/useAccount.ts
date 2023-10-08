import { enabledNetworks, getNetwork } from '@/networks';
import type { Vote } from '@/types';
import { loadTopicVotes } from '@/helpers/api';

const votes: Ref<Record<string, Vote>> = ref({});
const topicVotes: Ref<Record<string, number>> = ref({});

export function useAccount() {
  const { web3 } = useWeb3();

  async function loadVotes() {
    const account = web3.value.account;

    const allNetworkVotes = await Promise.all(
      enabledNetworks.map(networkId => {
        const network = getNetwork(networkId);
        return network.api.loadUserVotes(account);
      })
    );

    topicVotes.value = Object.fromEntries(
      (await loadTopicVotes(account)).map(vote => [vote.topic.id, vote.choice])
    );

    votes.value = allNetworkVotes.reduce((acc, b) => ({ ...acc, ...b }));
  }

  function voted(topic) {
    return topicVotes.value[topic];
  }

  return { account: web3.value.account, loadVotes, votes, topicVotes, voted };
}
