import { getExecutionData as _getExecutionData } from '@snapshot-labs/sx';
import { MetaTransaction } from '@snapshot-labs/sx/dist/utils/encoding/execution-hash';
import { Space } from '@/types';

type SpaceExecutionData = Pick<Space, 'executors' | 'executors_types'>;
type ExecutorType = Parameters<typeof _getExecutionData>[0];

export function getExecutionData(
  space: SpaceExecutionData,
  executionStrategy: string,
  transactions: MetaTransaction[]
) {
  const supportedExecutionIndex = space.executors.findIndex(
    executor => executor === executionStrategy
  );

  if (supportedExecutionIndex === -1) {
    throw new Error('No supported executor configured for this space');
  }

  const executorType = space.executors_types[supportedExecutionIndex] as ExecutorType;
  return _getExecutionData(executorType, executionStrategy, {
    transactions
  });
}

export function createStrategyPicker({
  supportedAuthenticators,
  supportedStrategies,
  relayerAuthenticators
}: {
  supportedAuthenticators: Record<string, boolean | undefined>;
  supportedStrategies: Record<string, boolean | undefined>;
  relayerAuthenticators: Record<string, 'evm' | 'starknet' | undefined>;
}) {
  return function pick(authenticators: string[], strategies: string[], isContract = false) {
    const candidateAuthenticators = authenticators.filter(
      authenticator => supportedAuthenticators[authenticator]
    );

    const authenticator = isContract
      ? candidateAuthenticators.find(authenticator => !relayerAuthenticators[authenticator])
      : candidateAuthenticators.find(authenticator => relayerAuthenticators[authenticator]) ||
        candidateAuthenticators[0];

    const selectedStrategies = strategies
      .map((strategy, index) => ({ address: strategy, index } as const))
      .filter(({ address }) => supportedStrategies[address]);

    if (!authenticator || (strategies.length !== 0 && selectedStrategies.length === 0)) {
      throw new Error('Unsupported space');
    }

    return {
      relayerType: relayerAuthenticators[authenticator],
      authenticator,
      strategies: selectedStrategies
    };
  };
}
