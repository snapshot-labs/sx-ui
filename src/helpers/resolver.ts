import { getProvider } from '@/helpers/provider';
import { memoize } from '@/helpers/utils';
import { NetworkID } from '@/types';

const provider = getProvider(5);

type ResolvedName = {
  networkId: NetworkID;
  address: string;
};

function createResolver() {
  const cache = new Map<string, ResolvedName | null>();

  function resolveStatic(id: string): ResolvedName | null {
    const parts = id.split(':');

    return {
      networkId: parts[0] as NetworkID,
      address: parts[1]
    };
  }

  async function resolveEns(id: string): Promise<ResolvedName | null> {
    const resolvedAddress = await provider.resolveName(id);

    if (!resolvedAddress) {
      return null;
    }

    return {
      networkId: 'gor',
      address: resolvedAddress.toLocaleLowerCase()
    };
  }

  async function resolveName(id: string) {
    if (cache.has(id)) {
      return cache.get(id);
    }

    const resolved = id.endsWith('.eth') ? await resolveEns(id) : resolveStatic(id);
    if (resolved) {
      cache.set(id, resolved);
    }

    return resolved;
  }

  return {
    resolveName: memoize(resolveName)
  };
}

export const resolver = createResolver();
