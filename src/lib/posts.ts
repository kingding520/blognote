import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export async function allPosts(): Promise<Post[]> {
  return (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function categories(posts: Post[]) {
  return [...new Set(posts.map((post) => post.data.category))];
}

export function folderForPost(post: Post) {
  const parts = post.id.split('/');
  return parts.length > 1 ? parts.slice(0, -1).join('/') : post.data.category;
}

export function folders(posts: Post[]) {
  const paths = new Set<string>();
  for (const post of posts) {
    const parts = folderForPost(post).split('/');
    for (let depth = 1; depth <= parts.length; depth++) paths.add(parts.slice(0, depth).join('/'));
  }
  return [...paths];
}

export function childFolders(posts: Post[], parent = '') {
  return folders(posts).filter((path) => {
    const divider = path.lastIndexOf('/');
    return (divider < 0 ? '' : path.slice(0, divider)) === parent;
  });
}

export function folderPostCount(posts: Post[], folder: string) {
  return posts.filter((post) => folderForPost(post) === folder || folderForPost(post).startsWith(`${folder}/`)).length;
}

export function urlForPost(post: Post, base: string) {
  return `${base}posts/${post.id}/`;
}

export function urlForCategory(category: string, base: string) {
  return `${base}category/${category.split('/').map(encodeURIComponent).join('/')}/`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Shanghai' }).format(date);
}
