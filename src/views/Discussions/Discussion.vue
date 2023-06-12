<script setup lang="ts">
import { apollo, DISCUSSION_QUERY, DISCUSSIONS_QUERY } from '@/helpers/api';
import { ref } from 'vue';

const route = useRoute();

const id = route.params.discussion as string;

const discussion = ref({});
const replies = ref([]);
const loadingDiscussion = ref<boolean>(false);
const loadedDiscussion = ref<boolean>(false);
const loadingReplies = ref<boolean>(false);
const loadedReplies = ref<boolean>(false);

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
              class="text-skin-text inline-block mb-2"
            >
              <IH-folder class="inline-block" /> {{ discussion.category.name }}
            </router-link>
            <h1 v-text="discussion.title" />
          </div>
          <Reply :reply="discussion" class="border-b-0" />
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
