import { PostMetadata } from '../generators/processPost';
import { SiteConfig } from '../types/config';

export interface PostListItem {
  title: string;
  date: string;
  url: string;
  lang: string;
}

/**
 * Extract URL components (lang/YYYY/MM/DD/slug) from file path
 */
export function extractUrlFromPath(filePath: string): string | null {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const match = normalizedPath.match(/(\d{4})\/(\d{2})\/(\d{2})\/([a-z]{2})\/([^/]+)\.md$/);

  if (!match) {
    return null;
  }

  const [, year, month, day, lang, slug] = match;
  return `${lang}/posts/${year}/${month}/${day}/${slug}/`;
}

/**
 * Generate post list for sidebar
 * Sorts posts by date descending and takes top N items
 * Filters by language if specified
 */
export function generatePostList(posts: PostMetadata[], config: SiteConfig, lang?: string): PostListItem[] {
  const filteredPosts = lang ? posts.filter(post => post.lang === lang) : posts;
  const sortedPosts = [...filteredPosts].sort((a, b) => b.date.localeCompare(a.date));
  const sidebarPosts = sortedPosts.slice(0, config.sidebarMaxItems);

  return sidebarPosts
    .map(post => {
      const url = extractUrlFromPath(post.filePath);
      if (!url) {
        console.warn(`Failed to extract URL from path: ${post.filePath}`);
        return null;
      }

      return {
        title: post.title,
        date: post.date,
        url,
        lang: post.lang
      };
    })
    .filter((item): item is PostListItem => item !== null);
}
