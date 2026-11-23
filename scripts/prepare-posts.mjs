import { readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, extname, isAbsolute, join, relative, resolve, sep } from 'node:path';

export const postsDirectory = resolve('src/content/posts');

function folderCategory(filePath) {
  const folder = relative(postsDirectory, dirname(resolve(filePath)));
  if (!folder || folder.startsWith('..') || isAbsolute(folder)) return null;
  return folder.split(sep)[0];
}

function todayInChina() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date());
  const part = (type) => parts.find((item) => item.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export async function preparePost(filePath) {
  if (extname(filePath).toLowerCase() !== '.md') return false;
  const original = await readFile(filePath, 'utf8');
  const category = folderCategory(filePath);
  if (/^\uFEFF?---(?:\r?\n|$)/.test(original)) {
    if (!category) return false;
    const frontmatter = original.match(/^(\uFEFF?---\r?\n)([\s\S]*?)(\r?\n---(?:\r?\n|$))/);
    if (!frontmatter) return false;
    const line = frontmatter[2].match(/^category:[^\r\n]*$/m)?.[0];
    const value = line?.slice('category:'.length).trim();
    if (value === category || value === JSON.stringify(category)) return false;
    const newline = original.includes('\r\n') ? '\r\n' : '\n';
    const updatedHeader = line
      ? frontmatter[2].replace(/^category:[^\r\n]*$/m, `category: ${JSON.stringify(category)}`)
      : `${frontmatter[2]}${newline}category: ${JSON.stringify(category)}`;
    await writeFile(filePath, original.replace(frontmatter[0], frontmatter[1] + updatedHeader + frontmatter[3]), 'utf8');
    return true;
  }

  const bom = original.startsWith('\uFEFF') ? '\uFEFF' : '';
  const content = bom ? original.slice(1) : original;
  const newline = content.includes('\r\n') ? '\r\n' : '\n';
  const header = [
    '---',
    'title: 文章标题',
    'description: 文章摘要',
    `date: ${todayInChina()}`,
    `category: ${JSON.stringify(category || '分类')}`,
    'tags: []',
    'draft: true',
    '---',
    '',
  ].join(newline);
  await writeFile(filePath, bom + header + content, 'utf8');
  return true;
}

export async function preparePosts(directory = postsDirectory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filePath = join(directory, entry.name);
    if (entry.isDirectory()) await preparePosts(filePath);
    else if (entry.isFile()) await preparePost(filePath);
  }
}
