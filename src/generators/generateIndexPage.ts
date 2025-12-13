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
    content: contentHtml
  });

  const indexPath = path.join(outputDir, 'index.html');
  fs.writeFileSync(indexPath, html, 'utf-8');
  console.log(`Generated: ${indexPath}`);
}
