import * as fs from 'fs';
import * as path from 'path';
import { marked } from 'marked';
import { renderTemplate } from '../utils/templateEngine';
import { PostMetadata } from './processPost';
import { SiteConfig } from '../types/config';

export function generateIndexPage(posts: PostMetadata[], outputDir: string, config: SiteConfig): void {
  // Find the latest post (max date)
  const latestPost = posts.reduce((latest, current) => {
    return current.date > latest.date ? current : latest;
  });

  console.log(`Latest post: ${latestPost.title} (${latestPost.date})`);

  // Generate HTML for the latest post content
  const contentHtml = marked(latestPost.content) as string;

  // Sort posts by date descending and take top N items
  const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const sidebarPosts = sortedPosts.slice(0, config.sidebarMaxItems);

  // Generate post list with URLs for sidebar
  const postList = sidebarPosts.map(post => {
    // Extract YYYY/MM/DD/slug from file path (handle both \ and / separators)
    const normalizedPath = post.filePath.replace(/\\/g, '/');
    const match = normalizedPath.match(/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\.md$/);
    if (!match) {
      console.warn(`Failed to match path: ${post.filePath}`);
      return null;
    }
    const [, year, month, day, slug] = match;
    return {
      title: post.title,
      date: post.date,
      url: `${year}/${month}/${day}/${slug}/`
    };
  }).filter(Boolean);

  // Generate index.html using template
  const html = renderTemplate('index.njk', {
    title: config.siteName,
    description: config.siteDescription,
    lang: 'ja',
    currentYear: new Date().getFullYear(),
    siteName: config.siteName,
    basePath: config.basePath,
    author: config.author,
    post: latestPost,
    content: contentHtml,
    posts: postList
  });

  const indexPath = path.join(outputDir, 'index.html');
  fs.writeFileSync(indexPath, html, 'utf-8');
  console.log(`Generated: ${indexPath}`);
}
