import { ref, computed, Ref } from 'vue';
import snapshot from '@snapshot-labs/snapshot.js';
import { formatUnits } from '@ethersproject/units';

const assets: Ref<any[]> = ref([]);
const loading = ref(false);

export function useBalances() {
  async function loadBalances(address) {
    loading.value = true;
    const key = 'ckey_2d082caf47f04a46947f4f212a8';
    const url = `https://api.covalenthq.com/v1/1/address/${address}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=true&key=${key}`;
    const results = await snapshot.utils.getJSON(url);
    const ether = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
    const etherItem = results.data.items.find(
      item => item.contract_address === ether
    );
    assets.value = [
      etherItem,
      ...results.data.items.filter(
        item =>
          parseFloat(
            formatUnits(item.balance || 0, item.contract_decimals || 0)
          ) > 0.001 && item.contract_address !== ether
      )
    ].sort((a, b) => b.quote - a.quote);
    loading.value = false;
  }

  const assetsMap = computed(
    () => new Map(assets.value.map(asset => [asset.contract_address, asset]))
  );

  return { loading, assets, assetsMap, loadBalances };
}
