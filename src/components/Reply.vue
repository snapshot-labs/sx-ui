<script setup lang="ts">
import { ref } from 'vue';
import { shortenAddress, _rt } from '@/helpers/utils';
import { apollo, TOPICS_QUERY } from '@/helpers/api';

const props = defineProps<{ reply: any; discussion: any }>();

const loading = ref<boolean>(false);
const loaded = ref<boolean>(false);
const replyFormOpen = ref(false);
const repliesOpen = ref(false);
const replies = ref({});

function toggleReplyForm() {
  replyFormOpen.value = !replyFormOpen.value;
}

function toggleReplies() {
  repliesOpen.value = !repliesOpen.value;

  if (repliesOpen.value === true && !loaded.value && !loading.value) {
    loadReplies();
  }
}

async function loadReplies() {
  loading.value = true;

  const { data } = await apollo.query({
    query: TOPICS_QUERY,
    variables: {
      parent: parseInt(props.reply.id)
    }
  });

  replies.value = data.discussions;
  loading.value = false;
  loaded.value = true;
}
</script>

<template>
  <div class="flex">
    <div class="px-2" />
    <div class="flex-grow">
      <div class="py-4 group border-b" :class="{ '!border-b-0': !reply.parent }">
        <div class="flex mr-4">
          <Score :topic="reply" class="mr-3" />
          <div class="w-full">
            <div class="flex text-skin-text text-sm mb-2">
              <div class="flex-1 space-x-2">
                <router-link
                  :to="{ name: 'user', params: { id: reply.author.id } }"
                  class="space-x-2"
                >
                  <Stamp :id="reply.author.id" :size="24" />
                  <span
                    v-text="reply.author.name ? reply.author.name : shortenAddress(reply.author.id)"
                  />
                  <span
                    class="bg-skin-border text-skin-link rounded-md inline-block px-[6px] text-center text-[14px]"
                  >
                    {{ reply.author.vote_count + reply.author.topic_count }}
                  </span>
                </router-link>
                <IS-pencil v-if="discussion?.author.id === reply.author.id" class="inline-block" />
                <span v-text="_rt(1693250154)" />
              </div>
            </div>
            <Markdown :body="reply.content" class="max-w-[650px] py-1 text-[20px]" />
            <div class="text-sm space-x-2">
              <a v-if="reply.reply_count && reply.parent" @click="toggleReplies">
                <IH-reply class="inline-block" /> {{ reply.reply_count }} Replies
              </a>
              <a @click="toggleReplyForm"> <IH-annotation class="inline-block" /> Reply </a>
            </div>
          </div>
          <div class="invisible group-hover:visible">
            <UiDropdown>
              <template #button>
                <IH-dots-horizontal class="inline-block" />
              </template>
              <template #items>
                <UiDropdownItem v-slot="{ active }">
                  <button class="flex items-center gap-2" :class="{ 'opacity-80': active }">
                    <IS-cursor-click :width="16" /> Pin
                  </button>
                </UiDropdownItem>
                <UiDropdownItem v-slot="{ active }">
                  <button class="flex items-center gap-2" :class="{ 'opacity-80': active }">
                    <IS-pencil :width="16" /> Edit
                  </button>
                </UiDropdownItem>
                <UiDropdownItem v-slot="{ active }">
                  <button class="flex items-center gap-2" :class="{ 'opacity-80': active }">
                    <IS-trash :width="16" /> Delete
                  </button>
                </UiDropdownItem>
              </template>
            </UiDropdown>
          </div>
        </div>
        <ReplyForm v-if="replyFormOpen" :reply="reply" />
      </div>
      <div v-if="repliesOpen">
        <div v-if="loading" class="ml-4 py-4 border-b">
          <UiLoading />
        </div>
        <div v-else>
          <Reply v-for="(r, i) in replies" :key="i" :reply="r" :discussion="discussion" />
        </div>
      </div>
    </div>
  </div>
</template>
