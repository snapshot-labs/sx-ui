<template>
  <div>
    <div class="py-8 mb-6 border-b hero">
      <Container class="max-w-screen-md">
        <div class="eyebrow mb-3" v-text="'Propose, vote, execute'" />
        <h1 class="mb-5 mono">The protocol for programmable governance.</h1>
      </Container>
    </div>
    <Container class="max-w-screen-md space-y-8">
      <div class="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 text-center">
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
          <IS-chip class="inline-block w-[32px] h-[32px] mb-2" />
          <h3>Transaction builder</h3>
          <div>It's free for users to propose or cast a vote.</div>
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
          <IS-shield-check class="inline-block w-[32px] h-[32px] mb-2" />
          <h3>Transaction simulation</h3>
          <div>It's free for users to propose or cast a vote.</div>
        </div>
        <div>
          <IS-collection class="inline-block w-[32px] h-[32px] mb-2" />
          <h3>Proposal drafts</h3>
          <div>It's free for users to propose or cast a vote.</div>
        </div>
        <div>
          <IS-briefcase class="inline-block w-[32px] h-[32px] mb-2" />
          <h3>Cross chain execution</h3>
          <div>It's free for users to propose or cast a vote.</div>
        </div>
        <div>
          <IS-clock class="inline-block w-[32px] h-[32px] mb-2" />
          <h3>Dynamic quorum</h3>
          <div>It's free for users to propose or cast a vote.</div>
        </div>
        <div>
          <IS-cursor-click class="inline-block w-[32px] h-[32px] mb-2" />
          <h3>Optimistic governance</h3>
          <div>Run a governance where you vote to reject a proposal.</div>
        </div>
        <div>
          <IS-cash class="inline-block w-[32px] h-[32px] mb-2" />
          <h3>Cross chain voting power</h3>
          <div>It's free for users to propose or cast a vote.</div>
        </div>
      </div>
      <div class="space-y-2 border rounded-lg p-4 text-center">
        <h3>Ready to get started?</h3>
        <div class="space-x-2">
          <a href="https://tally.so/r/wA2D2o" target="_blank">
            <UiButton class="primary">Sign up for beta</UiButton>
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
