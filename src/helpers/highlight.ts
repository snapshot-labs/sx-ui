import fetch from 'cross-fetch';

const HIGHLIGHT_URL: string = import.meta.env.VITE_HIGHLIGHT_URL || '';

export async function invoke(data: any, url = HIGHLIGHT_URL) {
  const init = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'invoke',
      params: {
        agent: 'discussions',
        fn: 'discuss',
        data
      },
      id: null
    })
  };
  const res = await fetch(url, init);
  return (await res.json()).result;
}

export const domain = {
  name: 'snapshot-x',
  version: '0.1.0'
};

export const discussType = {
  Discuss: [
    { name: 'author', type: 'address' },
    { name: 'space', type: 'string' },
    { name: 'category', type: 'uint256' },
    { name: 'title', type: 'string' },
    { name: 'content', type: 'string' },
    { name: 'created', type: 'uint64' }
  ]
};

export async function discuss(signer, message) {
  const unit = await sign(signer, message, discussType);
  return invoke(unit);
}

export async function sign(signer, message, types): Promise<any> {
  const address = await signer.getAddress();
  const signature = await signer._signTypedData(domain, types, message);

  return {
    address,
    signature,
    domain,
    types,
    message
  };
}
