import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { enabledNetworks, getNetwork } from '@/networks';
import type { Space, NetworkID } from '@/types';
import pkg from '../../package.json';

const SPACES_LIMIT = 10;

type NetworkRecord = {
  spacesMap: Record<string, Space>;
  spacesList: string[];
  hasMoreSpaces: boolean;
};

export const useSpacesStore = defineStore('spaces', {
  state: () => ({
    loading: false,
    loadingMore: false,
    loaded: false,
    networksMap: Object.fromEntries(
      enabledNetworks.map(network => [
        network,
        {
          spacesMap: {},
          spacesList: [],
          hasMoreSpaces: true
        } as NetworkRecord
      ])
    ),
    starredSpacesIds: useStorage(`${pkg.name}.spaces-starred`, [] as string[])
  }),
  getters: {
    spaces: state =>
      Object.values(state.networksMap).flatMap(record =>
        record.spacesList.map(spaceId => record.spacesMap[spaceId])
      ),
    spacesMap: state =>
      new Map(
        Object.values(state.networksMap).flatMap(record =>
          Object.values(record.spacesMap).map(space => [`${space.network}:${space.id}`, space])
        )
      ),
    hasMoreSpaces: state =>
      Object.values(state.networksMap).some(record => record.hasMoreSpaces === true)
  },
  actions: {
    async _fetchSpaces(overwrite: boolean) {
      const results = await Promise.all(
        enabledNetworks.map(async id => {
          const network = getNetwork(id);

          const record = this.networksMap[id];
          if (!record.hasMoreSpaces) {
            return {
              id,
              spaces: [],
              hasMoreSpaces: false
            };
          }

          const spaces = await network.api.loadSpaces({
            skip: overwrite ? 0 : record.spacesList.length,
            limit: SPACES_LIMIT
          });

          return {
            id,
            spaces,
            hasMoreSpaces: spaces.length === SPACES_LIMIT
          };
        })
      );

      this.networksMap = Object.fromEntries(
        results.map(result => {
          return [
            result.id,
            {
              spacesList: [
                ...this.networksMap[result.id].spacesList,
                ...result.spaces.map(space => space.id)
              ],
              spacesMap: {
                ...this.networksMap[result.id].spacesMap,
                ...Object.fromEntries(result.spaces.map(space => [space.id, space]))
              },
              hasMoreSpaces: result.hasMoreSpaces
            }
          ];
        })
      ) as Record<NetworkID, NetworkRecord>;
    },
    async fetch() {
      if (this.loading || this.loaded) return;
      this.loading = true;

      await this._fetchSpaces(true);

      this.loaded = true;
      this.loading = false;
    },
    async fetchMore() {
      if (this.loading || !this.loaded) return;
      this.loadingMore = true;

      await this._fetchSpaces(false);

      this.loadingMore = false;
    },
    async fetchSpace(spaceId: string, networkId: NetworkID) {
      const network = getNetwork(networkId);

      const space = await network.api.loadSpace(spaceId);

      this.networksMap[networkId].spacesMap = {
        ...this.networksMap[networkId].spacesMap,
        [spaceId]: space
      };
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
