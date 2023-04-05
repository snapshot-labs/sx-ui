<script setup>
import { useUiStore } from '@/stores/ui';

const route = useRoute();
const uiStore = useUiStore();
const { modalOpen } = useModal();
const { userSkin } = useUserSkin();
const { init, app } = useApp();
const { web3, web3Account } = useWeb3();
const { loadVotes, votes } = useAccount();

provide('web3', web3);

const skin = computed(() => userSkin.value);
const scrollDisabled = computed(() => modalOpen.value || uiStore.sidebarOpen);
const backdropLeftOffset = computed(() => {
  const isOffset = ['space', 'settings'].includes(route.matched[0]?.name) && !route.meta.hideNav;
  return `${72 + (isOffset ? 240 : 0)}px`;
});

onMounted(async () => {
  uiStore.restorePendingTransactions();
  await init();
});

watch(scrollDisabled, val => {
  const el = document.body;
  el.classList[val ? 'add' : 'remove']('overflow-hidden');
});

watch(web3Account, async () => {
  if (web3Account.value) return await loadVotes();
  votes.value = {};
});

watch(route, () => {
  uiStore.sidebarOpen = false;
});
</script>

<template>
  <div
    :class="{ [skin]: true, 'overflow-hidden': scrollDisabled }"
    class="font-serif text-base min-h-screen bg-skin-bg text-skin-text antialiased"
  >
    <UiLoading v-if="app.loading || !app.init" class="overlay big" />
    <div v-else class="pb-6 flex">
      <Sidebar class="lg:visible" :class="{ invisible: !uiStore.sidebarOpen }" />
      <Topnav v-if="!route.meta.hideTopNav" @toggle="uiStore.toggleSidebar" />
      <Nav v-if="!route.meta.hideNav" />
      <div
        v-if="uiStore.sidebarOpen"
        class="backdrop lg:hidden"
        :style="{
          left: backdropLeftOffset
        }"
        @click="uiStore.toggleSidebar"
      />
      <div
        class="flex-auto w-full"
        :class="{
          'translate-x-[72px] lg:translate-x-0': uiStore.sidebarOpen
        }"
      >
        <router-view
          :key="route.path"
          class="flex-auto ml-0"
          :class="{ 'mt-[72px] lg:ml-[72px]': !route.meta.hideTopNav }"
        />
      </div>
    </div>
    <Notifications />
    <div id="modal" />
  </div>
</template>

<style>
.backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background: rgba(0, 0, 0, 0.4);
}
</style>
