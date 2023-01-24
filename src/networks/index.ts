import { createStarknetNetwork } from './starknet';
import { createEvmNetwork } from './evm';

export { createStarknetNetwork, createEvmNetwork };

export const currentNetwork = createEvmNetwork();
