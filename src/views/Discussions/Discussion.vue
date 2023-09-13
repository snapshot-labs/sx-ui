<script setup lang="ts">
import { apollo, TOPIC_QUERY, TOPICS_QUERY } from '@/helpers/api';
import { ref } from 'vue';

const route = useRoute();

const id = route.params.topic as string;

const topic = ref<any>({});
const replies = ref([]);
const loadingTopic = ref<boolean>(false);
const loadedTopic = ref<boolean>(false);
const loadingReplies = ref<boolean>(false);
const loadedReplies = ref<boolean>(false);

async function loadTopic() {
  loadingTopic.value = true;

  const { data } = await apollo.query({
    query: TOPIC_QUERY,
    variables: { id }
  });

  topic.value = data.topic;
  loadingTopic.value = true;
  loadedTopic.value = true;
}

async function loadReplies() {
  loadingReplies.value = true;

  const { data } = await apollo.query({
    query: TOPICS_QUERY,
    variables: {
      parent: parseInt(id)
    }
  });

  replies.value = data.topics;
  loadingReplies.value = true;
  loadedReplies.value = true;
}

onMounted(() => {
  loadTopic();
  loadReplies();
});
</script>

<template>
  <div>
    <UiLoading v-if="loadingTopic && !loadedTopic" class="block p-4" />
    <div v-else-if="loadedTopic" class="space-y-4">
      <div>
        <div>
          <div class="px-4 pt-4 pb-0">
            <h1 v-text="topic.title" />
            <div class="inline-block flex items-center space-x-1">
              <router-link
                :to="{
                  name: 'space-discussions',
                  params: { category: topic.category.id }
                }"
                class="text-skin-link inline-block"
              >
                <div class="flex items-center">
                  <IH-folder class="inline-block w-[18px] h-[18px] mr-2" />
                  <h4 class="text-skin-link" v-text="topic.category.name" />
                </div>
              </router-link>
            </div>
          </div>
          <Reply :reply="topic" :topic="topic" class="border-b-0" />
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
          <Reply v-for="(reply, i) in replies" :key="i" :reply="reply" :topic="topic" />
        </div>
      </div>
    </div>
  </div>
</template>
