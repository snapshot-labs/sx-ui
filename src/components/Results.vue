<script setup lang="ts">
import { Proposal as ProposalType } from '@/types';

withDefaults(
  defineProps<{
    proposal: ProposalType;
    width?: number | 'full';
  }>(),
  {
    width: 100
  }
);
</script>

<template>
  <div class="flex items-center h-full">
    <div
      class="rounded-full h-[6px] overflow-hidden"
      :class="width === 'full' ? 'w-full' : `w-[${width}px]`"
    >
      <div
        v-for="(score, i) in Array(3)"
        :key="i"
        class="choice-bg float-left h-full"
        :style="{
          width: `${(
            (100 / proposal.scores_total) *
            proposal[`scores_${i + 1}`]
          ).toFixed(3)}%`
        }"
        :class="`_${i + 1}`"
      />
    </div>
  </div>
</template>
