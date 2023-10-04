<script setup lang="ts">
import { getNetwork } from '@/networks';
import { shortenAddress, _rt, _n } from '@/helpers/utils';
import { CHOICES } from '@/helpers/constants';
import { Proposal as ProposalType, Vote } from '@/types';

const LIMIT = 20;

const props = defineProps<{
  proposal: ProposalType;
}>();

defineEmits<{
  (e: 'close');
}>();

const votes: Ref<Vote[]> = ref([]);
const loaded = ref(false);
const loadingMore = ref(false);
const hasMore = ref(false);
const sortBy = ref('vp-desc' as 'vp-desc' | 'vp-asc' | 'created-desc' | 'created-asc');
const choiceFilter = ref('any' as 'any' | 'for' | 'against' | 'abstain');

const network = computed(() => getNetwork(props.proposal.network));
const votingPowerDecimals = computed(() => {
  return Math.max(
    ...props.proposal.space.strategies_parsed_metadata.map(metadata => metadata.decimals),
    0
  );
});

function reset() {
  votes.value = [];
  loaded.value = false;
  loadingMore.value = false;
  hasMore.value = false;
}

async function loadVotes() {
  votes.value = await network.value.api.loadProposalVotes(
    props.proposal,
    { limit: LIMIT },
    choiceFilter.value,
    sortBy.value
  );
  hasMore.value = votes.value.length === LIMIT;
  loaded.value = true;
}

async function handleEndReached() {
  if (loadingMore.value || !hasMore.value) return;

  loadingMore.value = true;
  const newVotes = await network.value.api.loadProposalVotes(
    props.proposal,
    {
      limit: LIMIT,
      skip: votes.value.length
    },
    choiceFilter.value,
    sortBy.value
  );
  hasMore.value = newVotes.length === LIMIT;
  votes.value = [...votes.value, ...newVotes];
  loadingMore.value = false;
}

onMounted(() => {
  loadVotes();
});

watch(
  () => props.proposal.id,
  (toId, fromId) => {
    if (toId === fromId) return;

    reset();
  }
);

watch([sortBy, choiceFilter], () => {
  reset();
  loadVotes();
});
</script>

<template>
  <div class="flex mx-4 my-4 gap-3 justify-between">
    <UiSelect
      v-model="choiceFilter"
      title="Choice"
      gap="12px"
      placement="left"
      :items="[
        { key: 'any', label: 'Any' },
        { key: 'for', label: 'For', indicator: 'bg-choice-for' },
        { key: 'against', label: 'Against', indicator: 'bg-choice-against' },
        { key: 'abstain', label: 'Abstain', indicator: 'bg-choice-abstain' }
      ]"
    />
    <UiSelect
      v-model="sortBy"
      title="Sort by"
      gap="12px"
      placement="right"
      :items="[
        { key: 'vp-desc', label: 'Voting Power - High to low' },
        { key: 'vp-asc', label: 'Voting Power - Low to high' },
        { key: 'created-desc', label: 'Vote time - Newest first' },
        { key: 'created-asc', label: 'Vote time - Oldest first' }
      ]"
    />
  </div>

  <BlockInfiniteScroller :loading-more="loadingMore" @end-reached="handleEndReached">
    <table class="text-right w-full">
      <thead>
        <tr class="border-b">
          <th class="text-left pl-4 eyebrow text-skin-text pb-2">Votes</th>
          <th class="eyebrow text-skin-text hidden lg:table-cell">Date</th>
          <th class="eyebrow text-skin-text">Choice</th>
          <th class="eyebrow text-skin-text">Voting Power</th>
          <th class="w-[60px] lg:w-[80px]" />
        </tr>
      </thead>
      <td v-if="!loaded" colspan="5">
        <UiLoading class="p-4 block text-center" />
      </td>
      <template v-else>
        <div v-if="votes.length === 0" class="p-4 text-center col-span-full">
          There isn't any votes yet!
        </div>
        <tbody>
          <tr v-for="(vote, i) in votes" :key="i" class="border-b relative">
            <td class="text-left flex items-center pl-4 py-3">
              <Stamp :id="vote.voter.id" :size="36" class="mr-3" />
              <div>
                <router-link
                  :to="{
                    name: 'user',
                    params: {
                      id: `${proposal.network}:${vote.voter.id}`
                    }
                  }"
                  @click="$emit('close')"
                >
                  {{ vote.voter.name || shortenAddress(vote.voter.id) }}
                </router-link>
              </div>
            </td>
            <td class="hidden lg:table-cell">{{ _rt(vote.created) }}</td>
            <td>
              <div class="text-skin-link" v-text="CHOICES[vote.choice]" />
            </td>
            <td>
              <div class="text-skin-link">
                {{ _n(vote.vp / 10 ** votingPowerDecimals) }}
                {{ proposal.space.voting_power_symbol }}
              </div>
              <div class="text-sm">{{ _n((vote.vp / proposal.scores_total) * 100) }}%</div>
            </td>
            <td>
              <div class="flex justify-end pr-4">
                <UiDropdown>
                  <template #button>
                    <IH-dots-vertical class="text-skin-link" />
                  </template>
                  <template #items>
                    <UiDropdownItem v-slot="{ active }">
                      <a
                        :href="network.helpers.getExplorerUrl(vote.tx, 'transaction')"
                        target="_blank"
                        class="flex items-center gap-2"
                        :class="{ 'opacity-80': active }"
                      >
                        <IH-arrow-sm-right class="-rotate-45" :width="16" />
                        View on block explorer
                      </a>
                    </UiDropdownItem>
                  </template>
                </UiDropdown>
              </div>
            </td>
            <div
              class="absolute choice-bg top-0 bottom-0 right-0 opacity-10 pointer-events-none"
              :style="{
                width: `${((100 / proposal.scores_total) * vote.vp).toFixed(2)}%`
              }"
              :class="`_${vote.choice}`"
            />
          </tr>
        </tbody>
      </template>
    </table>
  </BlockInfiniteScroller>
</template>
