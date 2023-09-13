<script setup lang="ts">
import { _n } from '@/helpers/utils';
import { client } from '@/helpers/client';
import { useAccount } from '@/composables/useAccount';

const props = defineProps<{ topic: any }>();

const { web3 } = useWeb3();
const { topicVotes, voted } = useAccount();

const loading = ref<boolean>(false);
const score = ref<number>(props.topic.score);

async function handleVote(choice: number) {
  loading.value = true;
  const account = web3.value.account;

  const receipt = await client.discussions.vote({
    voter: account,
    topic: props.topic.id,
    choice
  });

  console.log('Receipt', receipt);
  if (voted(props.topic.id)) {
    score.value -= voted(props.topic.id);
  }
  score.value += choice;
  topicVotes.value[props.topic.id] = choice;
  loading.value = false;
}
</script>

<template>
  <div class="flex flex-col items-center -mt-1 -mb-1 text-center">
    <a @click="handleVote(1)">
      <IH-chevron-up
        class="inline-block w-[20px] h-[20px] text-skin-text hover:text-green"
        :class="{
          'text-green': voted(topic.id) === 1 && !loading
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
          'text-red': voted(topic.id) === -1 && !loading
        }"
      />
    </a>
  </div>
</template>
