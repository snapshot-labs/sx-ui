<script setup lang="ts">
import { _n } from '@/helpers/utils';
import { vote } from '@/helpers/highlight';
import { useAccount } from '@/composables/useAccount';

const props = defineProps<{ discussion: any }>();

const { web3 } = useWeb3();
const { discussionsVotes, voted } = useAccount();

const loading = ref<boolean>(false);
const score = ref<number>(props.discussion.score);

async function handleVote(choice: number) {
  loading.value = true;
  const account = web3.value.account;

  const result = await vote({
    author: account,
    discussion: props.discussion.discussion_id,
    choice
  });

  console.log('Result', result);
  if (voted(props.discussion.id)) {
    score.value -= voted(props.discussion.id);
  }
  score.value += choice;
  discussionsVotes.value[props.discussion.id] = choice;
  loading.value = false;
}
</script>

<template>
  <div class="flex flex-col items-center -mt-1 -mb-1 text-center">
    <a @click="handleVote(1)">
      <IH-chevron-up
        class="inline-block w-[20px] h-[20px] text-skin-text hover:text-green"
        :class="{
          'text-green': voted(discussion.id) === 1 && !loading
        }"
      />
    </a>
    <div class="w-[40px] h-[24px] text-center relative">
      <UiLoading v-if="loading" class="absolute -top-[2px] left-[10px]" />
      <div v-else class="text-skin-link font-bold" v-text="_n(score)" />
    </div>
    <a @click="handleVote(-1)">
      <IH-chevron-down
        class="inline-block w-[20px] h-[20px] text-skin-text hover:text-red"
        :class="{
          'text-red': voted(discussion.id) === -1 && !loading
        }"
      />
    </a>
  </div>
</template>
