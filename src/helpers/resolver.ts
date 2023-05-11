import { getProvider } from '@/helpers/provider';
import { NetworkID } from '@/types';

const provider = getProvider(5);

type ResolvedName = {
  networkId: NetworkID;
  address: string;
};

function memoize<T extends any[], U>(fn: (...args: T) => U) {
  const cache = new Map<string, any>();

  return (...args: T): U => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);

    return result;
  };
}

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
