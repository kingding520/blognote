import { defineConfig } from 'astro/config';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = repository && !repository.endsWith('.github.io') ? `/${repository}` : '/';

export default defineConfig({
  site: process.env.SITE_URL || 'https://example.com',
  base,
  trailingSlash: 'always',
});
