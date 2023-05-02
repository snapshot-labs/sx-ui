<script setup lang="ts">
import { shortenAddress, _rt } from '@/helpers/utils';

const props = defineProps<{ reply: any }>();
</script>

<template>
  <div class="border-b py-4 flex">
    <Stamp :id="reply.author" :size="44" class="mr-4 sticky z-10 top-[83px] lg:top-[84px]" />
    <div class="w-full">
      <div class="text-skin-text text-sm mb-2 space-x-2">
        <span v-text="shortenAddress(reply.author)" />
        <span v-text="_rt(reply.created)" />
      </div>
      <Markdown :body="reply.content" class="max-w-[650px] mb-3 text-[20px] mb-1" />
      <div class="space-x-2">
        <IH-chevron-up class="inline-block w-[20px] h-[20px] text-green" />
        <IH-chevron-down class="inline-block w-[20px] h-[20px] text-red" />
      </div>
    </div>
  </div>
</template>
