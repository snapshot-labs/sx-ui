import { enabledNetworks, getNetwork } from '@/networks';
import type { Vote } from '@/types';
import { loadDiscussionVotes } from '@/helpers/api';

const votes: Ref<Record<string, Vote>> = ref({});
const discussionsVotes: Ref<Record<string, number>> = ref({});

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

    discussionsVotes.value = Object.fromEntries(
      (await loadDiscussionVotes(account)).map(vote => [vote.discussion.id, vote.choice])
    );

    votes.value = allNetworkVotes.reduce((acc, b) => ({ ...acc, ...b }));
  }

  function voted(discussion) {
    return discussionsVotes.value[discussion] && discussionsVotes.value[discussion];
  }

  return { account: web3.value.account, loadVotes, votes, discussionsVotes, voted };
}
