<script lang="ts" setup>
import { compareAddresses } from '@/helpers/utils';

const route = useRoute();
const uiStore = useUiStore();
const spacesStore = useSpacesStore();

const { param } = useRouteParser('id');
const { resolved, address, networkId } = useResolve(param);
const { web3 } = useWeb3();

const currentRouteName = computed(() => String(route.matched[0]?.name));
const space = computed(() =>
  currentRouteName.value === 'space' && resolved.value
    ? spacesStore.spacesMap.get(`${networkId.value}:${address.value}`)
    : null
);

const { treasury } = useTreasury(space);

const isController = computed(() =>
  space.value ? compareAddresses(space.value.controller, web3.value.account) : false
);
const navigationConfig = computed(() => ({
  space: {
    overview: {
      name: 'Overview',
      icon: IconHeroiconsOutlineGlobeAlt
    },
    proposals: {
      name: 'Proposals',
      icon: IconHeroiconsOutlineNewspaper
    },
    ...(space.value?.delegation_api_url
      ? {
          delegates: {
            name: 'Delegates',
            icon: IconHeroiconsOutlineLightningBolt
          }
        }
      : undefined),
    ...(treasury.value
      ? {
          treasury: {
            name: 'Treasury',
            icon: IconHeroiconsOutlineCash
          }
        }
      : undefined),
    ...(isController.value
      ? {
          settings: {
            name: 'Settings',
            icon: IconHeroiconsOutlineCog
          }
        }
      : undefined)
  },
  settings: {
    spaces: {
      name: 'My spaces',
      icon: IconHeroiconsOutlineStop
    },
    contacts: {
      name: 'Contacts',
      icon: IconHeroiconsOutlineUsers
    }
  }
}));
const navigationItems = computed(() => navigationConfig.value[currentRouteName.value || '']);
</script>

<template>
  <div
    v-if="navigationItems"
    class="lg:visible fixed w-[240px] border-r left-[72px] top-0 bottom-0 z-10 bg-skin-bg"
    :class="{
      invisible: !uiStore.sidebarOpen
    }"
  >
    <div class="h-[72px] border-b" />
    <div class="py-4">
      <router-link
        v-for="(item, key) in navigationItems"
        :key="key"
        :to="{ name: `${currentRouteName}-${key}` }"
        class="px-4 py-[6px] space-x-2 flex items-center"
        :class="route.name === `${currentRouteName}-${key}` ? 'text-skin-link' : 'text-skin-text'"
      >
        <component :is="item.icon" class="inline-block"></component>
        <span v-text="item.name" />
      </router-link>
    </div>
  </div>
</template>
