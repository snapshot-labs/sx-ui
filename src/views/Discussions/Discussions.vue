<script setup lang="ts">
import { ref } from 'vue';
import { _n } from '@/helpers/utils';
import { apollo, CATEGORIES_QUERY, CATEGORY_QUERY, DISCUSSIONS_QUERY } from '@/helpers/api';
import { Space } from '@/types';

defineProps<{ space: Space }>();

const router = useRouter();
const route = useRoute();

const categoryId = (route.params.category as string) || '0';

const category = ref<any>({});
const loading = ref<boolean>(false);
const loaded = ref<boolean>(false);
const loadingCategories = ref<boolean>(false);
const loadingDiscussions = ref<boolean>(false);
const loadedCategories = ref<boolean>(false);
const loadedDiscussions = ref<boolean>(false);
const categories = ref<any[]>([]);
const discussions = ref<any[]>([]);

async function loadCategories() {
  loadingCategories.value = true;

  const { data } = await apollo.query({
    query: CATEGORIES_QUERY,
    variables: {
      first: 4,
      parent: `discussions/${categoryId}`
    }
  });

  categories.value = data.categories;
  loadingCategories.value = false;
  loadedCategories.value = true;
}

async function loadDiscussions() {
  loadingDiscussions.value = true;

  const { data } = await apollo.query({
    query: DISCUSSIONS_QUERY,
    variables: {
      first: 5,
      category: categoryId === '0' ? undefined : `discussions/${categoryId}`,
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
      id: `discussions/${categoryId}`
    }
  });

  category.value = data.category;
  loading.value = false;
  loaded.value = true;
}

onMounted(async () => {
  loadDiscussions();

  if (categoryId !== '0') {
    await loadCategory();
  }

  if (category.value.category_count || categoryId === '0') {
    loadCategories();
  }
});
</script>

<template>
  <div class="p-4 space-x-2 flex">
    <div class="flex-auto">
      <div v-if="category.parent" class="flex items-center space-x-3">
        <router-link
          :to="{ name: 'space-discussions', params: { category: category.parent.slice(4) } }"
        >
          <UiButton class="!px-0 w-[46px]">
            <IH-arrow-narrow-left class="inline-block" />
          </UiButton>
        </router-link>
        <h3 v-text="category.name" />
      </div>
    </div>
    <router-link :to="{ name: 'discuss', params: { category: categoryId } }">
      <UiTooltip title="New topic">
        <UiButton class="!px-0 w-[46px]">
          <IH-pencil-alt class="inline-block" />
        </UiButton>
      </UiTooltip>
    </router-link>
    <UiDropdown>
      <template #button>
        <UiButton class="!px-0 w-[46px]">
          <IH-dots-horizontal class="inline-block" />
        </UiButton>
      </template>
      <template #items>
        <UiDropdownItem v-slot="{ active }">
          <button
            class="flex items-center gap-2"
            :class="{ 'opacity-80': active }"
            @click="router.push({ name: 'space-roles' })"
          >
            <IS-users :width="16" /> Roles
          </button>
        </UiDropdownItem>
        <UiDropdownItem v-slot="{ active }">
          <button
            class="flex items-center gap-2"
            :class="{ 'opacity-80': active }"
            @click="router.push({ name: 'new-category', params: { parent: categoryId } })"
          >
            <IH-plus :width="16" /> Create category
          </button>
        </UiDropdownItem>
        <UiDropdownItem v-slot="{ active }">
          <button
            class="flex items-center gap-2"
            :class="{ 'opacity-80': active }"
            @click="
              router.push({
                name: 'discussions-category-settings',
                params: { category: categoryId }
              })
            "
          >
            <IS-pencil :width="16" /> Edit category
          </button>
        </UiDropdownItem>
        <UiDropdownItem v-slot="{ active }">
          <button class="flex items-center gap-2" :class="{ 'opacity-80': active }">
            <IS-trash :width="16" /> Delete category
          </button>
        </UiDropdownItem>
      </template>
    </UiDropdown>
  </div>
  <div class="space-y-4">
    <div v-if="category.category_count || categoryId === '0'">
      <Label label="Categories" sticky />
      <UiLoading v-if="loadingCategories && !loadedCategories" class="px-4 py-3 block" />
      <div
        v-else-if="loadedCategories && categories.length === 0"
        class="px-4 py-3 flex items-center text-skin-link"
      >
        <IH-exclamation-circle class="inline-block mr-2" />
        There are no categories.
      </div>
      <div v-else>
        <router-link
          v-for="(c, i) in categories"
          :key="i"
          :to="{ name: 'space-discussions', params: { category: c.category_id } }"
          class="flex justify-between items-center mx-4 py-3 border-b"
        >
          <div>
            <div
              class="w-[48px] h-[48px] bg-skin-border rounded-lg items-center justify-center flex mr-3"
            >
              <IH-folder class="inline-block" />
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-skin-link" v-text="c.name" />
            <div class="text-skin-text space-x-2">
              <span>{{ _n(c.discussion_count) }} topic(s)</span>
            </div>
          </div>
          <div>
            <span
              v-if="category.discussion_count > 4"
              class="w-[8px] h-[8px] bg-blue rounded-full inline-block mb-1"
            />
          </div>
        </router-link>
      </div>
    </div>
    <div>
      <h4
        class="eyebrow border-b py-2 px-4 text-skin-text sticky z-10 top-[71px] lg:top-[72px] bg-skin-bg flex"
      >
        <span class="flex-grow">Topics</span>
        <div>
          Sort by <span class="text-skin-link">New</span>
          <IS-chevron-down class="inline-block text-skin-link mb-[2px]" />
        </div>
      </h4>
      <UiLoading v-if="loadingDiscussions && !loadedDiscussions" class="px-4 py-3 block" />
      <div
        v-else-if="loadedDiscussions && discussions.length === 0"
        class="px-4 py-3 flex items-center text-skin-link"
      >
        <IH-exclamation-circle class="inline-block mr-2" />
        There are no topics.
      </div>
      <div v-else>
        <Discussion v-for="(discussion, i) in discussions" :key="i" :discussion="discussion" />
      </div>
    </div>
  </div>
</template>
