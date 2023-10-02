<script setup lang="ts">
import { getNetwork } from '@/networks';
import { shortenAddress, _rt, _n, shorten } from '@/helpers/utils';
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
  <Label label="Votes" sticky />
  <UiLoading v-if="!loaded" class="p-4 block text-center" />
  <div v-else-if="votes.length > 0">
    <BlockInfiniteScroller :loading-more="loadingMore" @end-reached="handleEndReached">
      <div
        v-for="(vote, i) in votes"
        :key="i"
        class="py-3 px-4 border-b relative"
        :class="{ 'last:border-b-0': !loadingMore }"
      >
        <div class="flex items-center justify-space-between relative z-[1]">
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
            <div class="text-sm">
              {{ _rt(vote.created) }} at
              <a
                class="inline-flex items-center"
                target="_blank"
                :href="network.helpers.getExplorerUrl(vote.tx, 'transaction')"
              >
                {{ shorten(vote.tx) }}
                <IH-arrow-sm-right class="inline-block ml-1 -rotate-45" />
              </a>
            </div>
          </div>
          <div class="flex-[4]"></div>
          <div class="text-skin-link" v-text="CHOICES[vote.choice]" />
          <div class="flex-1 text-end">
            <div class="text-skin-link">
              {{ _n(vote.vp) }} {{ proposal.space.voting_power_symbol }}
            </div>
            <div class="text-sm">{{ _n((vote.vp / proposal.scores_total) * 100) }}%</div>
          </div>
        </div>
        <div
          class="absolute choice-bg top-0 bottom-0 right-0 opacity-10 pointer-events-none"
          :style="{
            width: `${((100 / proposal.scores_total) * vote.vp).toFixed(2)}%`
          }"
          :class="`_${vote.choice}`"
        />
      </div>
    </BlockInfiniteScroller>
  </div>
  <div v-else class="p-4 text-center">There isn't any votes yet!</div>
</template>
