<script setup lang="ts">
import { useSpacesStore } from '@/stores/spaces';
import { NetworkID } from '@/types';

const route = useRoute();
const spacesStore = useSpacesStore();
const id = route.params.id as string;
const [networkId, spaceId] = id.split(':');

onMounted(() => {
  spacesStore.fetchSpace(spaceId, networkId as NetworkID);
});
</script>

<template>
  <Layout :loading="!spacesStore.spacesMap.has(id)">
    <router-view :space="spacesStore.spacesMap.get(id)" />
  </Layout>
</template>
