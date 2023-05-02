import fetch from 'cross-fetch';

const HIGHLIGHT_URL: string = import.meta.env.VITE_HIGHLIGHT_URL || '';

export async function invoke(params: any, url = HIGHLIGHT_URL) {
  const init = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'invoke',
      params,
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

export const discussionType = {
  Discussion: [
    { name: 'space', type: 'address' },
    { name: 'title', type: 'string' },
    { name: 'content', type: 'string' },
    { name: 'author', type: 'address' },
    { name: 'created', type: 'address' }
  ]
};

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
