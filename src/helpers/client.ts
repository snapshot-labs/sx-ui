import { Client } from '@snapshot-labs/highlight';
import { Wallet } from '@ethersproject/wallet';

const API_URL = import.meta.env.VITE_API_URL || '';

const signer = Wallet.createRandom();

export const client = new Client({
  url: `${API_URL}/highlight/relayer`,
  signer
});
