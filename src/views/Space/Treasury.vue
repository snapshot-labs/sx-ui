<script setup>
import { onMounted, computed } from 'vue';
import { formatUnits } from '@ethersproject/units';
import { useBalances } from '@/composables/useBalances';
import space from '@/helpers/space.json';
import { _n, shorten, explorerUrl } from '@/helpers/utils';

defineProps({ space: Object });

const { loading, loaded, assets, loadBalances } = useBalances();

const totalQuote = computed(() =>
  assets.value.reduce((acc, asset) => {
    return acc + asset.quote;
  }, 0)
);

onMounted(() => loadBalances(space.wallet));
</script>

<template>
  <div class="space-y-3">
    <div>
      <Label :label="'Treasury'" />
      <a
        :href="explorerUrl('1', space.wallet)"
        target="_blank"
        class="flex justify-between items-center mx-4 py-3 block border-b"
      >
        <Stamp :id="space.wallet" type="avatar" :size="32" class="mr-3" />
        <div class="flex-1 leading-[24px]">
          <div class="text-md text-skin-link" v-text="shorten(space.wallet)" />
          <div class="text-skin-text">${{ _n(totalQuote) }}</div>
        </div>
        <IH-external-link class="float-right" />
      </a>
    </div>
    <div>
      <Label :label="'Assets'" />
      <UiLoading v-if="loading && !loaded" class="px-4 py-3 block" />
      <div
        v-for="(asset, i) in assets"
        :key="i"
        class="mx-4 py-3 border-b last:border-0 flex"
      >
        <Stamp
          :id="asset.contract_address"
          type="token"
          :size="32"
          class="mr-3 mt-2"
        />
        <div class="flex-auto">
          <div class="leading-[24px]">
            <div class="text-md text-skin-link">
              <span
                v-text="
                  _n(
                    formatUnits(
                      asset.balance || 0,
                      asset.contract_decimals || 0
                    )
                  )
                "
              />
              {{ asset.contract_ticker_symbol }}
            </div>
            <div>${{ _n(asset.quote) }}</div>
          </div>
        </div>
        <IH-arrow-sm-right class="mt-2" />
      </div>
    </div>
  </div>
</template>
