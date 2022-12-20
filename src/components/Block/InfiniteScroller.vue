<script setup lang="ts">
import { ref, watch, onBeforeUnmount, Ref } from 'vue';

defineProps<{
  loadingMore?: boolean;
}>();

const emit = defineEmits<{
  (e: 'endReached');
}>();

const container: Ref<HTMLElement | null> = ref(null);

const observer = new IntersectionObserver(
  ([entry]) => {
    if (!entry.isIntersecting) return;

    observer.unobserve(entry.target);
    emit('endReached');
  },
  {
    rootMargin: '200px'
  }
);

const mutationObserver = new MutationObserver(() => {
  if (!container.value) return;
  if (container.value.children.length === 0) return;

  const lastElement = container.value.children[container.value.children.length - 1];

  observer.observe(lastElement);
});

watch(container, v => {
  if (!v) return;

  mutationObserver.observe(v, { childList: true });

  if (v.children.length === 0) return;

  const lastElement = v.children[v.children.length - 1];
  observer.observe(lastElement);
});

onBeforeUnmount(() => {
  mutationObserver.disconnect();
  observer.disconnect();
});
</script>

<template>
  <div>
    <div ref="container">
      <slot />
    </div>
    <slot v-if="loadingMore" name="loading">
      <div class="flex justify-center">
        <UiLoading class="block px-4 py-3" />
      </div>
    </slot>
  </div>
</template>
