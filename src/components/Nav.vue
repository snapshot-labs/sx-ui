<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const currentRouteName = computed(() => String(route.matched[0]?.name));
</script>

<template>
  <NavSpace v-if="currentRouteName === 'space'" />
  <NavSettings v-if="currentRouteName === 'settings'" />
</template>
