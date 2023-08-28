<script setup lang="ts">
import { apollo, DISCUSSION_QUERY, DISCUSSIONS_QUERY } from '@/helpers/api';
import { ref } from 'vue';

const route = useRoute();

const id = route.params.discussion as string;

const discussion = ref<any>({});
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
      <div>
        <div>
          <div class="px-4 pt-4 pb-0">
            <h1 v-text="discussion.title" />
            <div class="inline-block flex items-center space-x-1">
              <router-link
                :to="{
                  name: 'space-discussions',
                  params: { category: discussion.category.category_id }
                }"
                class="text-skin-link inline-block"
              >
                <div class="flex items-center">
                  <IH-folder class="inline-block w-[18px] h-[18px] mr-2" />
                  <h4 class="text-skin-link" v-text="discussion.category.name" />
                </div>
              </router-link>
            </div>
          </div>
          <Reply :reply="discussion" :discussion="discussion" class="border-b-0" />
        </div>
        <h4
          class="eyebrow border-b py-2 px-4 text-skin-text sticky z-10 top-[71px] lg:top-[72px] bg-skin-bg flex"
        >
          <span class="flex-grow">Comments</span>
          <div>
            Sort by <span class="text-skin-link">New</span>
            <IS-chevron-down class="inline-block text-skin-link mb-[2px]" />
          </div>
        </h4>
        <UiLoading v-if="loadingReplies && !loadedReplies" class="block p-4" />
        <div
          v-else-if="loadingReplies && replies.length === 0"
          class="px-4 py-3 flex items-center text-skin-link"
        >
          <IH-exclamation-circle class="inline-block mr-2" />
          There are no comments.
        </div>
        <div v-else-if="loadedReplies">
          <Reply v-for="(reply, i) in replies" :key="i" :reply="reply" :discussion="discussion" />
        </div>
      </div>
    </div>
  </div>
</template>
