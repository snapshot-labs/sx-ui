<script setup lang="ts">
import { compareAddresses } from '@/helpers/utils';
import { getNetwork } from '@/networks';
import { StrategyConfig, StrategyTemplate } from '@/networks/types';
import { Space, StrategyParsedMetadata } from '@/types';

const props = defineProps<{ space: Space }>();

const network = computed(() => getNetwork(props.space.network));

const loading = ref(true);
const authenticators = ref([] as StrategyConfig[]);
const validationStrategy = ref(null as StrategyConfig | null);
const votingStrategies = ref([] as StrategyConfig[]);

async function getInitialStrategiesConfig(
  configured: string[],
  editorStrategies: StrategyTemplate[],
  params?: string[],
  metadata?: StrategyParsedMetadata[]
) {
  const promises = configured.map(async (configuredAddress, i) => {
    const strategy = editorStrategies.find(({ address }) =>
      compareAddresses(address, configuredAddress)
    );

    if (!strategy) return null;

    const resolvedParams =
      strategy.parseParams && params && metadata
        ? await strategy.parseParams(params[i], metadata[i])
        : {};

    return {
      id: crypto.randomUUID(),
      params: resolvedParams,
      ...strategy
    };
  });

  return (await Promise.all(promises)).filter(strategy => strategy !== null) as StrategyConfig[];
}

async function getInitialValidationStrategy(
  configuredAddress: string,
  editorStrategies: StrategyTemplate[],
  params: string,
  nestedStrategies: string[],
  nestedStrategiesParams: string[],
  nestedStrategiesMetadata: StrategyParsedMetadata[]
) {
  const strategy = editorStrategies.find(({ address }) =>
    compareAddresses(address, configuredAddress)
  );

  if (!strategy) return null;

  const resolvedParams = strategy.parseParams ? await strategy.parseParams(params, null) : {};
  const strategies = await getInitialStrategiesConfig(
    nestedStrategies,
    network.value.constants.EDITOR_VOTING_STRATEGIES,
    nestedStrategiesParams,
    nestedStrategiesMetadata
  );

  return {
    id: crypto.randomUUID(),
    params: {
      ...resolvedParams,
      strategies
    },
    ...strategy
  };
}

watchEffect(async () => {
  loading.value = true;

  authenticators.value = await getInitialStrategiesConfig(
    props.space.authenticators,
    network.value.constants.EDITOR_AUTHENTICATORS
  );

  votingStrategies.value = await getInitialStrategiesConfig(
    props.space.strategies,
    network.value.constants.EDITOR_VOTING_STRATEGIES,
    props.space.strategies_params,
    props.space.strategies_parsed_metadata
  );

  validationStrategy.value = await getInitialValidationStrategy(
    props.space.validation_strategy,
    network.value.constants.EDITOR_PROPOSAL_VALIDATIONS,
    props.space.validation_strategy_params,
    props.space.voting_power_validation_strategy_strategies,
    props.space.voting_power_validation_strategy_strategies_params,
    props.space.voting_power_validation_strategies_parsed_metadata
  );

  loading.value = false;
});
</script>

<template>
  <div class="space-y-4 mx-4 pt-4">
    <UiLoading v-if="loading" />
    <template v-else>
      <BlockSpaceFormStrategies
        v-model="authenticators"
        unique
        :available-strategies="network.constants.EDITOR_AUTHENTICATORS"
        title="Authenticators"
        description="Authenticators are customizable contracts that verify user identity for proposing and voting using different methods."
      />
      <BlockSpaceFormValidation
        v-model="validationStrategy"
        :available-strategies="network.constants.EDITOR_PROPOSAL_VALIDATIONS"
        :available-voting-strategies="network.constants.EDITOR_VOTING_STRATEGIES"
        title="Proposal validation"
        description="Proposal validation strategies are used to determine if a user is allowed to create a proposal."
      />
      <BlockSpaceFormStrategies
        v-model="votingStrategies"
        :available-strategies="network.constants.EDITOR_VOTING_STRATEGIES"
        title="Voting strategies"
        description="Voting strategies are customizable contracts used to define how much voting power each user has when casting a vote."
      />
      <UiButton class="w-full">Save</UiButton>
    </template>
  </div>
</template>
