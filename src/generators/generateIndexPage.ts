import * as fs from 'fs';
import * as path from 'path';
import { marked } from 'marked';
import { renderTemplate } from '../utils/templateEngine';
import { PostMetadata } from './processPost';
import { SiteConfig } from '../types/config';
import { generatePostList } from '../utils/postList';

export function generateIndexPage(posts: PostMetadata[], outputDir: string, config: SiteConfig): void {
  // Find the latest post (max date)
  const latestPost = posts.reduce((latest, current) => {
    return current.date > latest.date ? current : latest;
  });

  console.log(`Latest post: ${latestPost.title} (${latestPost.date})`);

  // Generate HTML for the latest post content
  const contentHtml = marked(latestPost.content) as string;

  // Generate post list for sidebar
  const postList = generatePostList(posts, config);

  // Generate canonical URL for top page
  const canonicalUrl = `https://${config.siteDomain}${config.basePath}/`;

  // Generate absolute OGP image URL if configured
  let ogImage: string | undefined;
  if (config.ogImage) {
    // If ogImage starts with http/https, use as-is; otherwise make it absolute
    if (config.ogImage.startsWith('http://') || config.ogImage.startsWith('https://')) {
      ogImage = config.ogImage;
    } else {
      ogImage = `https://${config.siteDomain}${config.ogImage}`;
    }
  }

  // Generate index.html using template
  const html = renderTemplate('index.njk', {
    title: config.siteName,
    description: config.siteDescription,
    lang: 'ja',
    currentYear: new Date().getFullYear(),
    siteName: config.siteName,
    siteDescription: config.siteDescription,
    basePath: config.basePath,
    author: config.author,
    avatarUrl: config.avatarUrl,
    bio: config.bio,
    githubUrl: config.githubUrl,
    twitterUrl: config.twitterUrl,
    canonicalUrl,
    ogType: 'website',
    ogImage,
    post: latestPost,
    content: contentHtml,
    posts: postList
  });

  const indexPath = path.join(outputDir, 'index.html');
  fs.writeFileSync(indexPath, html, 'utf-8');
  console.log(`Generated: ${indexPath}`);
}
