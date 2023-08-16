<template>
  <div>
    <div class="py-8 mb-6 hero">
      <Container class="max-w-screen-md">
        <div class="eyebrow mb-3 text-skin-link" v-text="'Propose, vote, execute'" />
        <h1 class="mb-5 mono">
          Governance<br />
          for organizations
        </h1>
        <a href="https://tally.so/r/wA2D2o" target="_blank">
          <UiButton class="primary !bg-green !border-green text-white">Sign up for beta</UiButton>
        </a>
      </Container>
    </div>
    <Container class="max-w-screen-md space-y-8">
      <div>
        <div class="mb-6 text-center">
          <div class="eyebrow mb-3 text-green" v-text="'Features'" />
          <h2>All what you need for your organization</h2>
        </div>
        <div class="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-3 gap-y-5 text-center">
          <div>
            <IS-cursor-click class="inline-block w-[32px] h-[32px] mb-2" />
            <h3>Gasless voting</h3>
            <div>It's free for users to propose or cast a vote.</div>
          </div>
          <div>
            <IS-cash class="inline-block w-[32px] h-[32px] mb-2" />
            <h3>Custom voting power</h3>
            <div>It's free for users to propose or cast a vote.</div>
          </div>
          <div>
            <IS-clock class="inline-block w-[32px] h-[32px] mb-2" />
            <h3>Timelock execution</h3>
            <div>It's free for users to propose or cast a vote.</div>
          </div>
          <div>
            <IS-cog class="inline-block w-[32px] h-[32px] mb-2" />
            <h3>Upgradable governance</h3>
            <div>Change governance settings overtime.</div>
          </div>
          <div>
            <IS-lightning-bolt class="inline-block w-[32px] h-[32px] mb-2" />
            <h3>Delegation dashboard</h3>
            <div>It's free for users to propose or cast a vote.</div>
          </div>
          <div>
            <IS-cash class="inline-block w-[32px] h-[32px] mb-2" />
            <h3>Treasury overview</h3>
            <div>It's free for users to propose or cast a vote.</div>
          </div>
          <div>
            <IS-pencil class="inline-block w-[32px] h-[32px] mb-2" />
            <h3>Feature-rich editor</h3>
            <div>Markdown, drafts, transaction builder and simulation.</div>
          </div>
          <div>
            <IS-chip class="inline-block w-[32px] h-[32px] mb-2" />
            <h3>Transaction builder</h3>
            <div>It's free for users to propose or cast a vote.</div>
          </div>
          <div>
            <IS-shield-check class="inline-block w-[32px] h-[32px] mb-2" />
            <h3>Transaction simulation</h3>
            <div>It's free for users to propose or cast a vote.</div>
          </div>
          <div>
            <IS-cursor-click class="inline-block w-[32px] h-[32px] mb-2" />
            <h3>Optimistic governance</h3>
            <div>Run a governance where you vote to reject a proposal.</div>
          </div>
          <div>
            <IS-cash class="inline-block w-[32px] h-[32px] mb-2" />
            <h3>Cross-chain voting power</h3>
            <div>
              It's free for users to propose.<br />
              <span class="tag">Coming soon</span>
            </div>
          </div>
          <div>
            <IS-arrows-expand class="inline-block w-[32px] h-[32px] mb-2" />
            <h3>Cross-chain execution</h3>
            <div>
              It's free for users to propose.<br />
              <span class="tag">Coming soon</span>
            </div>
          </div>
        </div>
      </div>
      <div class="space-y-2 rounded-lg p-4 text-center border">
        <h2 class="mb-3">Ready to get started?</h2>
        <div class="space-x-2">
          <a href="https://tally.so/r/wA2D2o" target="_blank">
            <UiButton class="primary !bg-green !border-green text-white">Sign up for beta</UiButton>
          </a>
        </div>
      </div>
      <div class="text-center sm:text-left">
        <div class="mb-2 sm:mb-0 inline-block">© Prototype Foundation, 2023</div>
        <div class="space-x-3 sm:float-right">
          <a href="https://twitter.com/SnapshotLabs" target="_blank">
            <img alt="Twitter" src="~@/assets/twitter.svg" class="w-[28px] h-[28px] inline-block" />
          </a>
          <a href="https://discord.gg/snapshot" target="_blank">
            <img alt="Discord" src="~@/assets/discord.svg" class="w-[28px] h-[28px] inline-block" />
          </a>
          <a href="https://github.com/snapshot-labs" target="_blank">
            <img alt="GitHub" src="~@/assets/github.svg" class="w-[28px] h-[28px] inline-block" />
          </a>
        </div>
      </div>
    </Container>
  </div>
</template>
