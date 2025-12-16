import * as path from 'path';
import * as fs from 'fs';
import { PostMetadata } from './processPost';
import { SiteConfig } from '../types/config';
import { extractUrlFromPath } from '../utils/postList';
import { renderTemplate } from '../utils/templateEngine';

/**
 * Generate sitemap.xml for SEO
 */
export function generateSitemap(posts: PostMetadata[], outputDir: string, config: SiteConfig, lang: string): void {
  const baseUrl = `https://${config.siteDomain}${config.basePath}`;
  const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  // Prepare template data
  const postsData = sortedPosts.map(post => {
    const url = extractUrlFromPath(post.filePath);
    if (!url) {
      console.warn(`Failed to extract URL from path: ${post.filePath}`);
      return null;
    }
    return {
      url,
      date: post.date
    };
  }).filter((item): item is NonNullable<typeof item> => item !== null);

  const xml = renderTemplate('sitemap.njk', {
    baseUrl,
    lang,
    latestDate: sortedPosts.length > 0 ? sortedPosts[0].date : null,
    posts: postsData
  });

  const outputPath = path.join(outputDir, lang, 'sitemap.xml');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, xml, 'utf-8');
  console.log(`Generated sitemap.xml (${lang}) with ${postsData.length + 1} URLs`);
}
