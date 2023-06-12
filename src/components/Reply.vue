<script setup lang="ts">
import { ref } from 'vue';
import { shortenAddress, _rt } from '@/helpers/utils';

const replyFormOpen = ref(false);

function toggleReplyForm() {
  replyFormOpen.value = !replyFormOpen.value;
}

defineProps<{ reply: any; isAuthor: boolean }>();
</script>

<template>
  <div class="border-b py-4">
    <div class="flex">
      <Score :discussion="reply" class="mr-3" />
      <div class="w-full">
        <div class="flex text-skin-text text-sm mb-2">
          <div class="flex-1 space-x-2">
            <router-link :to="{ name: 'user', params: { id: reply.author } }" class="space-x-2">
              <Stamp :id="reply.author" :size="24" />
              <span v-text="shortenAddress(reply.author)" />
            </router-link>
            <IS-pencil v-if="isAuthor" class="inline-block" />
            <span v-text="_rt(1e9)" />
          </div>
        </div>
        <Markdown :body="reply.content" class="max-w-[650px] py-1 text-[20px]" />
        <div class="text-sm space-x-2">
          <a @click="toggleReplyForm">
            <IS-reply class="inline-block" /> Reply
          </a>
          <a v-if="reply.reply_count">
            <IH-annotation class="inline-block" /> {{ reply.reply_count }} replies
          </a>
        </div>
      </div>
    </div>
    <ReplyForm v-if="replyFormOpen" :reply="reply" />
  </div>
</template>
