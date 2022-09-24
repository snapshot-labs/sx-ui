import { Ref, toRef } from 'vue';
import { defineStore } from 'pinia';
import apollo from '@/helpers/apollo';
import { PROPOSALS_QUERY, PROPOSAL_QUERY } from '@/helpers/queries';
import type { Proposal } from '@/types';

type SpaceRecord = {
  loading: boolean;
  loaded: boolean;
  proposals: Proposal[];
};

export const useProposalsStore = defineStore('proposals', {
  state: () => ({
    proposals: {} as Record<string, SpaceRecord | undefined>
  }),
  actions: {
    async fetchAll(spaceId: string) {
      if (!this.proposals[spaceId]) {
        this.proposals[spaceId] = {
          loading: false,
          loaded: false,
          proposals: []
        };
      }

      const record = toRef(this.proposals, spaceId) as Ref<SpaceRecord>;
      if (record.value.loading || record.value.loaded) return;

      record.value.loading = true;

      const { data } = await apollo.query({
        query: PROPOSALS_QUERY,
        variables: {
          first: 5,
          space: spaceId
        }
      });

      record.value.proposals = data.proposals;
      record.value.loaded = true;
      record.value.loading = false;
    },
    async fetchProposal(spaceId: string, proposalId: number) {
      if (!this.proposals[spaceId]) {
        this.proposals[spaceId] = {
          loading: false,
          loaded: false,
          proposals: []
        };
      }

      const record = toRef(this.proposals, spaceId) as Ref<SpaceRecord>;
      const alreadyFetched = record.value.proposals.find(
        proposal => proposal.proposal_id === proposalId
      );
      if (alreadyFetched) return;

      const { data } = await apollo.query({
        query: PROPOSAL_QUERY,
        variables: { id: `${spaceId}/${proposalId}` }
      });

      record.value.proposals.push(data.proposal);
    }
  }
});
