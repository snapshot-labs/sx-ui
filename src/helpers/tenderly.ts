import space from '@/helpers/space.json';

const TENDERLY_ACCESS_KEY = import.meta.env.VITE_TENDERLY_ACCESS_KEY;
const TENDERLY_USER = import.meta.env.VITE_TENDERLY_USER;

export async function simulate(tx) {
  const url = `https://api.tenderly.co/api/v1/account/me/project/project/simulate`;
  const body = {
    network_id: space.network,
    from: space.wallet,
    to: tx.to,
    input: tx.data,
    gas: 8000000,
    gas_price: '0',
    value: tx.value,
    save_if_fails: true
  };
  const init = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Access-Key': TENDERLY_ACCESS_KEY
    },
    body: JSON.stringify(body)
  };
  const res = await fetch(url, init);
  const json = await res.json();
  json._link = `https://dashboard.tenderly.co/${TENDERLY_USER}/project/simulator/${json.simulation.id}`;
  json._error = json.transaction.error_message;
  return json;
}
