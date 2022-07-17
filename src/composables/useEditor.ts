import { reactive, watch, computed } from 'vue';
import { lsGet, lsSet } from '@/helpers/utils';

const proposals = reactive(lsGet('proposals', {}));

function removeEmpty(proposals) {
  return Object.entries(proposals).reduce(
    (acc, [id, proposal]: [string, any]) => {
      if (Object.keys(proposal).length < 2 && proposal.execution.length === 0) {
        return acc;
      }

      return {
        ...acc,
        [id]: proposal
      };
    },
    {}
  );
}

export function useEditor() {
  watch(proposals, () => lsSet('proposals', removeEmpty(proposals)));

  const drafts = computed(() => removeEmpty(proposals));

  function removeDraft(key) {
    delete proposals[key];
  }

  return { proposals, drafts, removeDraft };
}
