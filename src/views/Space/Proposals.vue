<script setup>
import { onMounted, ref } from 'vue';
import apollo from '@/helpers/apollo';
import { PROPOSALS_QUERY } from '@/helpers/queries';

const proposals = ref([]);
const loaded = ref(false);

onMounted(async () => {
  const { data } = await apollo.query({
    query: PROPOSALS_QUERY,
    variables: { first: 24 }
  });
  proposals.value = data.proposals;
  loaded.value = true;
});
</script>

<template>
  <Container slim class="space-y-3">
    <UiLoading v-if="!loaded" class="block px-4 sm:px-0" />
    <Proposal
      v-for="(proposal, i) in proposals"
      v-else
      :key="i"
      :proposal="proposal"
    />
  </Container>
</template>
