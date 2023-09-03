import fetch from 'cross-fetch';
import { pin } from '@snapshot-labs/pineapple';

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
  return (await res.json()).result?.last_event_id;
}

export async function addCategory(data) {
  const metadata = {
    name: data.name,
    about: data.about
  };

  const { cid } = await pin(metadata);

  const metadataURI = `ipfs://${cid}`;
  const args = [data.parent, metadataURI];

  return await invoke('discussions', 'add_category', args);
}

export async function editProfile(data) {
  const metadata = {
    name: data.name,
    about: data.about
  };

  const { cid } = await pin(metadata);

  const metadataURI = `ipfs://${cid}`;
  const args = [data.user, metadataURI];

  return await invoke('profiles', 'edit_profile', args);
}

export async function discuss(data) {
  const metadata = {
    title: data.title,
    content: data.content
  };

  const { cid } = await pin(metadata);

  const metadataURI = `ipfs://${cid}`;
  const args = [data.author, data.category, data.parent, metadataURI];

  return await invoke('discussions', 'discuss', args);
}

export async function vote(data) {
  const args = [data.author, data.discussion, data.choice];

  return await invoke('discussions', 'vote', args);
}
