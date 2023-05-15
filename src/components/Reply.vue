<script setup lang="ts">
import { shortenAddress, _rt, _n } from '@/helpers/utils';

const props = defineProps<{ reply: any }>();
</script>

<template>
  <div class="border-b py-4 flex">
    <div class="mr-4">
      <div class="w-[44px] sticky z-10 top-[83px] lg:top-[84px]">
        <Stamp :id="reply.author" :size="44" />
      </div>
    </div>
    <div class="w-full">
      <div class="text-skin-text text-sm mb-2 space-x-2">
        <span v-text="shortenAddress(reply.author)" />
        <span v-text="_rt(reply.created)" />
      </div>
      <Markdown :body="reply.content" class="max-w-[650px] mb-3 text-[20px] mb-1" />
      <div class="space-x-2 flex items-center">
        <span
          v-if="reply.score"
          class="mr-1 text-sm"
          :class="reply.score > 0 ? 'text-green' : 'text-red'"
          v-text="_n(reply.score)"
        />
        <IH-chevron-up class="inline-block w-[20px] h-[20px] text-green" />
        <IH-chevron-down class="inline-block w-[20px] h-[20px] text-red" />
      </div>
    </div>
  </div>
</template>
