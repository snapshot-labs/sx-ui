<script setup lang="ts">
import { ref } from 'vue';
import { apollo, CATEGORY_QUERY, DISCUSSIONS_QUERY } from '@/helpers/api';
import { Space } from '@/types';

defineProps<{ space: Space }>();

const route = useRoute();

const categoryId = route.params.category as string;

const category = ref({});
const discussions = ref<any[]>([]);
const loading = ref<boolean>(false);
const loaded = ref<boolean>(false);
const loadingDiscussions = ref<boolean>(false);
const loadedDiscussions = ref<boolean>(false);

async function loadDiscussions() {
  loadingDiscussions.value = true;

  const { data } = await apollo.query({
    query: DISCUSSIONS_QUERY,
    variables: {
      category: categoryId ? `0x1/${categoryId}` : undefined,
      parent: 0
    }
  });

  discussions.value = data.discussions;
  loadingDiscussions.value = false;
  loadedDiscussions.value = true;
}

async function loadCategory() {
  loading.value = true;

  const { data } = await apollo.query({
    query: CATEGORY_QUERY,
    variables: {
      id: `0x1/${categoryId}`
    }
  });

  category.value = data.category;
  loading.value = false;
  loaded.value = true;
}

onMounted(() => {
  loadCategory();
  loadDiscussions();
});
</script>

<template>
  <UiLoading v-if="loading && !loaded" class="p-4 block" />
  <div v-else>
    <div class="p-4 space-x-2 flex">
      <div class="flex-auto flex items-center space-x-3">
        <router-link :to="{ name: 'space-discussions' }">
          <UiButton class="!px-0 w-[46px]">
            <IH-arrow-narrow-left class="inline-block" />
          </UiButton>
        </router-link>
        <h3 v-text="category.name" />
      </div>
      <router-link :to="{ name: 'discuss' }">
        <UiTooltip title="New discussion">
          <UiButton class="!px-0 w-[46px]">
            <IH-pencil-alt class="inline-block" />
          </UiButton>
        </UiTooltip>
      </router-link>
      <router-link
        :to="{ name: 'discussions-category-settings', params: { category: categoryId } }"
      >
        <UiTooltip title="Settings">
          <UiButton class="!px-0 w-[46px]">
            <IH-cog class="inline-block" />
          </UiButton>
        </UiTooltip>
      </router-link>
    </div>
    <div class="space-y-4">
      <div>
        <Label label="Latest discussions" sticky />
        <UiLoading v-if="loadingDiscussions && !loadedDiscussions" class="px-4 py-3 block" />
        <div
          v-else-if="loadedDiscussions && discussions.length === 0"
          class="px-4 py-3 flex items-center text-skin-link"
        >
          <IH-exclamation-circle class="inline-block mr-2" />
          There are no discussions.
        </div>
        <div v-else>
          <Discussion v-for="(discussion, i) in discussions" :key="i" :discussion="discussion" />
        </div>
      </div>
    </div>
  </div>
</template>
