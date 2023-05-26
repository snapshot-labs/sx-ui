<script setup lang="ts">
import { apollo, DISCUSSION_QUERY, DISCUSSIONS_QUERY } from '@/helpers/api';
import { discuss } from '@/helpers/highlight';
import { ref } from 'vue';
import { faker } from '@faker-js/faker';
import { sleep } from '@/helpers/utils';

const route = useRoute();
const { web3 } = useWeb3();

const id = route.params.discussion as string;

const discussion = ref({});
const replies = ref([]);
const loadingDiscussion = ref<boolean>(false);
const loadedDiscussion = ref<boolean>(false);
const loadingReplies = ref<boolean>(false);
const loadedReplies = ref<boolean>(false);
const loadingSubmit = ref<boolean>(false);

const comment = ref({
  content: faker.lorem.lines(1)
});

async function loadDiscussion() {
  loadingDiscussion.value = true;

  const { data } = await apollo.query({
    query: DISCUSSION_QUERY,
    variables: {
      id: `0x1/${id}`
    }
  });

  discussion.value = data.discussion;
  loadingDiscussion.value = true;
  loadedDiscussion.value = true;
}

async function loadReplies() {
  loadingReplies.value = true;

  const { data } = await apollo.query({
    query: DISCUSSIONS_QUERY,
    variables: {
      parent: parseInt(id)
    }
  });

  replies.value = data.discussions;
  loadingReplies.value = true;
  loadedReplies.value = true;
}

async function handleSubmit() {
  loadingSubmit.value = true;
  const account = web3.value.account;

  const result = await discuss({
    author: account,
    // @ts-ignore
    category: discussion.value.category.category_id,
    title: '',
    content: comment.value.content,
    // @ts-ignore
    parent: discussion.value.discussion_id
  });

  await sleep(2e3);

  comment.value.content = '';
  loadingSubmit.value = false;
  console.log('Result', result);
  loadReplies();
}

onMounted(() => {
  loadDiscussion();
  loadReplies();
});
</script>

<template>
  <div>
    <UiLoading v-if="loadingDiscussion && !loadedDiscussion" class="block p-4" />
    <div v-else-if="loadedDiscussion" class="space-y-4">
      <div class="pt-4">
        <div class="mx-4">
          <div>
            <router-link
              :to="{
                name: 'discussions-category',
                params: { category: discussion.category.category_id }
              }"
            >
              {{ discussion.category.name }}
            </router-link>
            <h1 v-text="discussion.title" />
          </div>
          <Reply :reply="discussion" class="border-b-0" />
        </div>
        <Label label="Reply" />
        <div v-if="loadedReplies" class="flex mx-4">
          <div class="w-[40px] mr-3" />
          <div class="s-box max-w-[650px] py-4 flex-1">
            <div class="s-base flex items-center">
              <input
                v-model="comment.content"
                :disabled="loadingSubmit"
                class="s-input !mb-0 !py-[12px] mr-2"
                placeholder="Type content here"
              />
              <UiButton :loading="loadingSubmit" class="button-outline" @click="handleSubmit">
                Submit
              </UiButton>
            </div>
          </div>
        </div>
        <Label label="Top replies" />
        <UiLoading v-if="loadingReplies && !loadedReplies" class="block p-4" />
        <div
          v-else-if="loadingReplies && replies.length === 0"
          class="px-4 py-3 flex items-center text-skin-link"
        >
          <IH-exclamation-circle class="inline-block mr-2" />
          There are no replies.
        </div>
        <div v-else-if="loadedReplies" class="mx-4">
          <Reply
            v-for="(reply, i) in replies"
            :key="i"
            :reply="reply"
            :is-author="discussion.author === reply.author"
          />
        </div>
      </div>
    </div>
  </div>
</template>
