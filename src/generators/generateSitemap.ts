import * as path from 'path';
import * as fs from 'fs';
import { PostMetadata } from './processPost';
import { SiteConfig } from '../types/config';
import { extractUrlFromPath } from '../utils/postList';

/**
 * Generate sitemap.xml for SEO
 */
export function generateSitemap(posts: PostMetadata[], outputDir: string, config: SiteConfig): void {
  const baseUrl = `https://${config.siteDomain}${config.basePath}`;
  const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add index page
  xml += '  <url>\n';
  xml += `    <loc>${baseUrl}/</loc>\n`;
  if (sortedPosts.length > 0) {
    xml += `    <lastmod>${sortedPosts[0].date}</lastmod>\n`;
  }
  xml += '    <changefreq>daily</changefreq>\n';
  xml += '    <priority>1.0</priority>\n';
  xml += '  </url>\n';

  // Add all posts
  for (const post of sortedPosts) {
    const url = extractUrlFromPath(post.filePath);
    if (!url) {
      console.warn(`Failed to extract URL from path: ${post.filePath}`);
      continue;
    }

    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/${url}</loc>\n`;
    xml += `    <lastmod>${post.date}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  }

  xml += '</urlset>\n';

  const outputPath = path.join(outputDir, 'sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf-8');
  console.log(`Generated sitemap.xml with ${sortedPosts.length + 1} URLs`);
}
