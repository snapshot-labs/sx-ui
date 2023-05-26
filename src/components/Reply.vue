<script setup lang="ts">
import { shortenAddress, _rt } from '@/helpers/utils';

defineProps<{ reply: any; isAuthor: boolean }>();
</script>

<template>
  <div class="border-b py-4 flex">
    <Score :discussion="reply" class="mr-3" />
    <div class="w-full">
      <div class="flex text-skin-text text-sm mb-3">
        <div class="flex-1 space-x-2">
          <Stamp :id="reply.author" :size="24" />
          <span v-text="shortenAddress(reply.author)" />
          <IS-pencil v-if="isAuthor" class="inline-block" />
        </div>
        <span v-text="_rt(1e9)" />
      </div>
      <Markdown :body="reply.content" class="max-w-[650px] mb-3 text-[20px] mb-1" />
    </div>
  </div>
</template>
