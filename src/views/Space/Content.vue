<script setup lang="ts">
import { Space } from '@/types';

defineProps<{ space: Space }>();

const pips = [
  {
    id: 1,
    name: 'PIP Purpose and Guidelines',
    description: 'Describes community standards for the Polygon ecosystem, including core protocol specifications',
    status: 'Continuous',
    type: 'Informational'
  },
  {
    id: 2,
    name: 'Proposal to distribute and decentralize staking power across the Polygon chain',
    description: 'Proposal to increase the minimun commission.',
    status: 'Stagnant',
    type: 'Contracts'
  },
  {
    id: 3,
    name: 'Auction Mechansim - A Mechanism to replace bad and under-performing validators',
    description: 'Proposes a mechanism to replace under-performing validators',
    status: 'Stagnant',
    type: 'Contracts'
  },
  {
    id: 4,
    name: 'Validator Performance Management Proposal',
    description: 'Proposes a framework that will allow further decentralization of the network by means of validator self-regulation.',
    status: 'Final',
    type: 'Contracts'
  }
]
</script>

<template>
  <div class="p-4 space-x-2 flex">
    <div class="flex-auto text-md leading-[26px] mb-3">
      <h2 class="mb-2">PIPs</h2>
      <div class="max-w-[640px]">
        Polygon Improvement Proposals (PIPs) describe community standards for the Polygon ecosystem, including core protocol specifications such as Heimdall and Bor, client APIs, and contract standards, etc.
        <a>Learn more</a>.
      </div>
      </div>
  </div>
  <div class="space-y-3">
    <div class="border-t">
      <div v-for="pip in pips" class="border-b py-3 px-4 flex items-center">
      <h4 class="w-[30px] text-center mr-4">
        #{{ pip.id }}
      </h4>
        <div class="flex-1">
          <h3 class="leading-6">{{ pip.name }}</h3>
          <div>{{ pip.description }}</div>
          <span
            class="rounded-full px-2 py-1 border text-[15px]"
          >
            {{ pip.type }}
          </span>
        </div>
        <div>
          <span
            class="text-white rounded-full px-2 py-1 text-sm"
            :class="{
            '!bg-yellow-400': pip.status === 'Continuous',
            '!bg-red': pip.status === 'Stagnant',
            '!bg-green': pip.status === 'Final'
          }"
          >
            {{ pip.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
