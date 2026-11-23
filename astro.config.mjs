import { defineConfig } from 'astro/config';
import { preparePost, preparePosts, postsDirectory } from './scripts/prepare-posts.mjs';
import { relative, isAbsolute } from 'node:path';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { unified } from '@astrojs/markdown-remark';
import { remarkUseSiteMermaidTheme } from './scripts/normalize-mermaid.mjs';

await preparePosts();

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = repository && !repository.endsWith('.github.io') ? `/${repository}` : '/';

export default defineConfig({
  site: process.env.SITE_URL || 'https://example.com',
  base,
  trailingSlash: 'always',
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkUseSiteMermaidTheme],
      rehypePlugins: [rehypeKatex],
    }),
  },
  vite: {
    plugins: [{
      name: 'prepare-new-posts',
      configureServer(server) {
        const prepareChangedPost = (filePath) => {
          const pathWithinPosts = relative(postsDirectory, filePath);
          if (!pathWithinPosts || pathWithinPosts.startsWith('..') || isAbsolute(pathWithinPosts)) return;
          setTimeout(() => {
            preparePost(filePath).catch((error) => {
              if (error.code !== 'ENOENT') server.config.logger.error(`补充文章顶部信息失败：${error.message}`);
            });
          }, 100);
        };
        server.watcher.on('add', prepareChangedPost);
        server.watcher.on('change', prepareChangedPost);
      },
    }],
  },
});
