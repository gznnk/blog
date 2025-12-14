import * as path from 'path';
import * as fs from 'fs';
import { PostMetadata } from './processPost';
import { SiteConfig } from '../types/config';
import { extractUrlFromPath } from '../utils/postList';
import { escapeHtml } from '../utils/escapeHtml';

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

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n';
  xml += '  <channel>\n';
  xml += `    <title>${escapeHtml(config.siteName)}</title>\n`;
  xml += `    <link>${escapeHtml(baseUrl)}/</link>\n`;
  xml += `    <description>${escapeHtml(config.siteDescription)}</description>\n`;
  xml += `    <language>ja</language>\n`;

  if (feedPosts.length > 0) {
    xml += `    <lastBuildDate>${toRfc822Date(feedPosts[0].date)}</lastBuildDate>\n`;
  }

  xml += `    <atom:link href="${escapeHtml(baseUrl)}/rss.xml" rel="self" type="application/rss+xml" />\n`;

  for (const post of feedPosts) {
    const url = extractUrlFromPath(post.filePath);
    if (!url) {
      console.warn(`Failed to extract URL from path: ${post.filePath}`);
      continue;
    }

    const postUrl = `${baseUrl}/${url}`;

    xml += '    <item>\n';
    xml += `      <title>${escapeHtml(post.title)}</title>\n`;
    xml += `      <link>${escapeHtml(postUrl)}</link>\n`;
    xml += `      <guid isPermaLink="true">${escapeHtml(postUrl)}</guid>\n`;
    xml += `      <pubDate>${toRfc822Date(post.date)}</pubDate>\n`;
    xml += `      <author>${escapeHtml(config.author)}</author>\n`;

    if (post.description) {
      xml += `      <description>${escapeHtml(post.description)}</description>\n`;
    }

    xml += '    </item>\n';
  }

  xml += '  </channel>\n';
  xml += '</rss>\n';

  const outputPath = path.join(outputDir, 'rss.xml');
  fs.writeFileSync(outputPath, xml, 'utf-8');
  console.log(`Generated rss.xml with ${feedPosts.length} items`);
}
