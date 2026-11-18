import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export async function allPosts(): Promise<Post[]> {
  return (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function categories(posts: Post[]) {
  return [...new Set(posts.map((post) => post.data.category))];
}

export function urlForPost(post: Post, base: string) {
  return `${base}posts/${post.id}/`;
}

export function urlForCategory(category: string, base: string) {
  return `${base}category/${encodeURIComponent(category)}/`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Shanghai' }).format(date);
}
