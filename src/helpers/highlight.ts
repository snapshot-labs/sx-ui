import fetch from 'cross-fetch';

const HIGHLIGHT_URL = `${import.meta.env.VITE_API_URL}/highlight/relayer`;

export async function invoke(agent, method, args: any, url = HIGHLIGHT_URL) {
  const init = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'relay',
      params: {
        messages: [
          {
            type: 'INVOKE_FUNCTION',
            payload: {
              agent,
              method,
              args
            }
          }
        ]
      },
      id: null
    })
  };

  const res = await fetch(url, init);
  return (await res.json()).result;
}

export async function vote(space, voter, proposalId, choice, chainId, sig) {
  return invoke('votes', 'vote', [space, voter, proposalId, choice, chainId, sig]);
}
