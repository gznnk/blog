import * as fs from 'fs';
import * as path from 'path';
import { marked } from 'marked';
import { generateIndexLayout } from '../layouts/indexLayout';
import { PostMetadata } from './processPost';

export function generateIndexPage(posts: PostMetadata[], outputDir: string): void {
  // Find the latest post (max date)
  const latestPost = posts.reduce((latest, current) => {
    return current.date > latest.date ? current : latest;
  });

  console.log(`Latest post: ${latestPost.title} (${latestPost.date})`);

  // Generate HTML for the latest post content
  const contentHtml = marked(latestPost.content) as string;

  // Generate index.html using layout
  const html = generateIndexLayout(latestPost, contentHtml);

  const indexPath = path.join(outputDir, 'index.html');
  fs.writeFileSync(indexPath, html, 'utf-8');
  console.log(`Generated: ${indexPath}`);
}
