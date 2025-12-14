import * as path from 'path';
import * as fs from 'fs';
import { PostMetadata } from './processPost';
import { SiteConfig } from '../types/config';
import { extractUrlFromPath } from '../utils/postList';
import { renderTemplate } from '../utils/templateEngine';

/**
 * Convert date string (YYYY-MM-DD) to RFC 822 format for RSS
 */
function toRfc822Date(dateString: string): string {
  // Parse date as local date and convert to UTC string
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  return date.toUTCString();
}

/**
 * Generate RSS feed (rss.xml) for blog posts
 */
export function generateRssFeed(posts: PostMetadata[], outputDir: string, config: SiteConfig): void {
  const baseUrl = `https://${config.siteDomain}${config.basePath}`;
  const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const feedPosts = sortedPosts.slice(0, config.rssMaxItems);

  // Prepare template data
  const postsData = feedPosts.map(post => {
    const url = extractUrlFromPath(post.filePath);
    if (!url) {
      console.warn(`Failed to extract URL from path: ${post.filePath}`);
      return null;
    }
    return {
      url,
      title: post.title,
      description: post.description,
      pubDate: toRfc822Date(post.date)
    };
  }).filter((item): item is NonNullable<typeof item> => item !== null);

  const xml = renderTemplate('rss.njk', {
    siteName: config.siteName,
    siteDescription: config.siteDescription,
    baseUrl,
    author: config.author,
    lastBuildDate: feedPosts.length > 0 ? toRfc822Date(feedPosts[0].date) : null,
    posts: postsData
  });

  const outputPath = path.join(outputDir, 'rss.xml');
  fs.writeFileSync(outputPath, xml, 'utf-8');
  console.log(`Generated rss.xml with ${postsData.length} items`);
}
