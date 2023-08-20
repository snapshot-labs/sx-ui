// import { pin } from '@snapshot-labs/pineapple';
import { vote as hlVote } from './highlight';

export const baseDomain = {
  name: 'snapshot-x',
  version: '1.0.0'
};

type EIP712VoteMessage = {
  space: string;
  voter: string;
  proposalId: number;
  choice: number;
};

export const voteTypes = {
  Vote: [
    { name: 'space', type: 'address' },
    { name: 'voter', type: 'address' },
    { name: 'proposalId', type: 'uint256' },
    { name: 'choice', type: 'uint8' }
  ]
};

export async function vote({ signer, data }): Promise<any> {
  const voter = await signer.getAddress();

  const domain = {
    ...baseDomain,
    chainId: data.chainId,
    verifyingContract: data.space
  };

  const message: EIP712VoteMessage = {
    space: data.space,
    voter,
    proposalId: data.proposal,
    choice: data.choice
  };

  const signature = await signer._signTypedData(domain, voteTypes, message);

  const signatureData = {
    address: voter,
    signature,
    domain,
    types: voteTypes,
    message
  };

  const receipt = await hlVote(
    data.space,
    voter,
    data.proposal,
    data.choice,
    data.chainId,
    signature
  );
  console.log('Receipt', receipt);

  // const file = await pin(signatureData);
  // console.log('IPFS CID', file.cid);

  return { signatureData, data };
}
