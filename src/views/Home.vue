<template>
  <div class="!pb-0">
    <div class="py-8 mb-8 hero border-b">
      <Container class="max-w-[880px]">
        <div class="my-3">
          <div class="eyebrow mb-4 text-skin-link" v-text="'Propose, vote, execute'" />
          <h1 class="mb-5 mono">
            Everything you need for<br />
            your governance
          </h1>
          <a href="https://tally.so/r/wA2D2o" target="_blank">
            <UiButton
              class="primary !bg-[#673de6] !border-[#673de6] !text-white !rounded-[4px] !h-auto px-5 py-3 font-bold"
              >Sign up for beta</UiButton
            >
          </a>
        </div>
      </Container>
    </div>
    <Container class="max-w-[880px] space-y-8">
      <div class="overflow-hidden py-6">
        <div class="grid sm:grid-cols-3 grid-cols-1 gap-x-3 gap-y-6 text-center">
          <div>
            <div class="text-center flex-grow mb-4">
              <div class="w-[132px] h-[132px] hero gard mx-auto" />
            </div>
            <h2 class="mb-4">Secure</h2>
          </div>
          <div>
            <div class="text-center flex-grow mb-4">
              <div class="w-[132px] h-[132px] hero gard mx-auto" />
            </div>
            <h2 class="mb-4">Modular</h2>
          </div>
          <div>
            <div class="text-center flex-grow mb-4">
              <div class="w-[132px] h-[132px] gard mx-auto" />
            </div>
            <h2 class="mb-4">Frictionless</h2>
          </div>
        </div>
      </div>
      <div class="overflow-hidden flex">
        <div class="mb-6 max-w-[440px]">
          <div class="eyebrow mb-4" v-text="'For organizations'" />
          <h1 class="mb-4">Everything you need for your organization</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </p>
        </div>
        <div class="text-center flex-grow mt-4">
          <div class="w-[220px] h-[220px] hero gard mx-auto" />
        </div>
      </div>
      <div class="overflow-hidden flex">
        <div class="text-center flex-grow mt-4">
          <div class="w-[220px] h-[220px] hero gard mx-auto" />
        </div>
        <div class="mb-6 max-w-[440px]">
          <div class="eyebrow mb-4" v-text="'For users'" />
          <h1 class="mb-4">Everything you need for your organization</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </p>
        </div>
      </div>
      <div class="pb-6">
        <div class="mb-6 text-center">
          <div class="eyebrow mb-4" v-text="'Features'" />
          <h1 class="max-w-[540px] mx-auto">Everything you need for your organization</h1>
        </div>
        <div class="grid sm:grid-cols-3 grid-cols-1 gap-x-3 gap-y-6 text-center">
          <div>
            <IS-cursor-click class="inline-block w-[28px] h-[28px] mb-2 text-green" />
            <h3>Gasless voting</h3>
          </div>
          <div>
            <IS-cash class="inline-block w-[28px] h-[28px] mb-2 text-green" />
            <h3>Custom voting power</h3>
          </div>
          <div>
            <IS-clock class="inline-block w-[28px] h-[28px] mb-2 text-green" />
            <h3>Timelock execution</h3>
          </div>
          <div>
            <IS-cog class="inline-block w-[28px] h-[28px] mb-2 text-green" />
            <h3>Upgradable governance</h3>
          </div>
          <div>
            <IS-lightning-bolt class="inline-block w-[28px] h-[28px] mb-2 text-green" />
            <h3>Delegation dashboard</h3>
          </div>
          <div>
            <IS-pencil class="inline-block w-[28px] h-[28px] mb-2 text-green" />
            <h3>Feature-rich editor</h3>
          </div>
          <div>
            <IS-cash class="inline-block w-[28px] h-[28px] mb-2 text-green" />
            <h3>Treasury overview</h3>
          </div>
          <div>
            <IS-pencil class="inline-block w-[28px] h-[28px] mb-2 text-green" />
            <h3>Feature-rich editor</h3>
          </div>
          <div>
            <IS-chip class="inline-block w-[28px] h-[28px] mb-2 text-green" />
            <h3>Transaction builder</h3>
          </div>
          <div>
            <IS-shield-check class="inline-block w-[28px] h-[28px] mb-2 text-green" />
            <h3>Transaction simulation</h3>
          </div>
          <div>
            <IS-shield-check class="inline-block w-[28px] h-[28px] mb-2 text-green" />
            <h3>Transaction simulation</h3>
          </div>
          <div>
            <IS-cursor-click class="inline-block w-[28px] h-[28px] mb-2 text-green" />
            <h3>Dynamic quorum</h3>
          </div>
          <div>
            <IS-cursor-click class="inline-block w-[28px] h-[28px] mb-2 text-green" />
            <h3>Governance template</h3>
            <span class="tag">Coming soon</span>
          </div>
          <div>
            <IS-cash class="inline-block w-[28px] h-[28px] mb-2 text-green" />
            <h3>Cross-chain voting power</h3>
            <span class="tag">Coming soon</span>
          </div>
          <div>
            <IS-arrows-expand class="inline-block w-[28px] h-[28px] mb-2 text-green" />
            <h3>Cross-chain execution</h3>
            <span class="tag">Coming soon</span>
          </div>
        </div>
      </div>
    </Container>
    <div class="border-y my-8 hero">
      <Container class="max-w-[880px]">
        <div class="space-y-2 rounded-lg py-7 text-center">
          <h1 class="mb-4">Ready to get started?</h1>
          <div class="space-x-2">
            <a href="https://tally.so/r/wA2D2o" target="_blank">
              <UiButton
                class="primary !bg-[#673de6] !border-[#673de6] !text-white !rounded-[4px] !h-auto px-5 py-3 font-bold"
                >Sign up for beta</UiButton
              >
            </a>
          </div>
        </div>
      </Container>
    </div>
    <div class="mx-4 py-4 text-center sm:text-left border-t">
      <div class="mb-2 sm:mb-0 inline-block text-skin-link">© Copyright 2023, Snapshot X</div>
      <div class="space-x-3 sm:float-right">
        <a href="https://twitter.com/SnapshotLabs" target="_blank">
          <img alt="Twitter" src="~@/assets/twitter.svg" class="w-[32px] h-[32px] inline-block" />
        </a>
        <a href="https://discord.gg/snapshot" target="_blank">
          <img alt="Discord" src="~@/assets/discord.svg" class="w-[32px] h-[32px] inline-block" />
        </a>
        <a href="https://github.com/snapshot-labs" target="_blank">
          <img alt="GitHub" src="~@/assets/github.svg" class="w-[32px] h-[32px] inline-block" />
        </a>
      </div>
    </div>
  </div>
</template>
