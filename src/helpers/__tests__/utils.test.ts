import { describe, it, expect } from 'vitest';

import { createErc1155Metadata } from '../utils';

describe('utils', () => {
  describe('createErc1155Metadata', () => {
    it('should create metadata', () => {
      const metadata = createErc1155Metadata({
        name: 'Test',
        description: 'Test description',
        externalUrl: 'https://test.com',
        githubUrl: 'https://github.com',
        twitterUrl: 'https://twitter.com',
        discordUrl: 'https://discord.com',
        treasuryAddress: '0x000000000000000000000000000000000000dead'
      });

      expect(metadata).toEqual({
        name: 'Test',
        description: 'Test description',
        external_url: 'https://test.com',
        properties: {
          github_url: 'https://github.com',
          twitter_url: 'https://twitter.com',
          discord_url: 'https://discord.com',
          treasury_address: '0x000000000000000000000000000000000000dead'
        }
      });
    });
  });
});
