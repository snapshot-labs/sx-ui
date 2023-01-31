import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { currentNetwork } from '@/networks';
import type { Space } from '@/types';
import pkg from '../../package.json';

const SPACES_LIMIT = 10;

export const useSpacesStore = defineStore('spaces', {
  state: () => ({
    loading: false,
    loadingMore: false,
    loaded: false,
    hasMoreSpaces: true,
    spaces: [] as Space[],
    starredSpacesIds: useStorage(`${pkg.name}.spaces-starred`, [] as string[])
  }),
  getters: {
    spacesMap: state => new Map(state.spaces.map(space => [space.id, space]))
  },
  actions: {
    async fetch() {
      if (this.loading) return;
      this.loading = true;

      const spaces = await currentNetwork.api.loadSpaces({
        skip: 0,
        limit: SPACES_LIMIT
      });

      this.spaces = spaces;
      this.hasMoreSpaces = spaces.length === SPACES_LIMIT;
      this.loaded = true;
      this.loading = false;
    },
    async fetchMore() {
      if (this.loading || !this.loaded) return;
      this.loadingMore = true;

      const spaces = await currentNetwork.api.loadSpaces({
        skip: this.spaces.length,
        limit: SPACES_LIMIT
      });

      this.spaces = [...this.spaces, ...spaces];
      this.hasMoreSpaces = spaces.length === SPACES_LIMIT;
      this.loadingMore = false;
    },
    async fetchSpace(id: string) {
      if (this.spacesMap.get(id)) return;

      const space = await currentNetwork.api.loadSpace(id);

      if (this.spacesMap.get(id)) return;
      this.spaces.push(space);
    },
    toggleSpaceStar(id: string) {
      if (this.starredSpacesIds.includes(id)) {
        this.starredSpacesIds = this.starredSpacesIds.filter((spaceId: string) => spaceId !== id);
      } else {
        this.starredSpacesIds.unshift(id);
      }
    }
  }
});
