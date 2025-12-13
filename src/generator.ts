import * as path from 'path';
import * as fs from 'fs';
import { findMarkdownFiles } from './utils/findMarkdownFiles';
import { processPost, PostMetadata } from './generators/processPost';
import { generateIndexPage } from './generators/generateIndexPage';
import { loadConfig } from './utils/loadConfig';
import { SiteConfig } from './types/config';

export interface GenerateResult {
  processed: number;
  skipped: number;
  errors: { file: string; errors: string[] }[];
}

export async function generateBlog(contentDir: string, outputDir: string): Promise<GenerateResult> {
  const result: GenerateResult = {
    processed: 0,
    skipped: 0,
    errors: []
  };

  // Load site configuration
  const config: SiteConfig = loadConfig();
  console.log(`Site: ${config.siteName}`);

  // Find all markdown files in content/posts/YYYY/MM/DD/*.md
  const postsDir = path.join(contentDir, 'posts');

  if (!fs.existsSync(postsDir)) {
    console.error(`Posts directory not found: ${postsDir}`);
    return result;
  }

  const markdownFiles = findMarkdownFiles(postsDir);
  const publicPosts: PostMetadata[] = [];

  for (const filePath of markdownFiles) {
    try {
      const postMeta = await processPost(filePath, contentDir, outputDir, result, config);
      if (postMeta) {
        publicPosts.push(postMeta);
      }
    } catch (error) {
      result.errors.push({
        file: filePath,
        errors: [error instanceof Error ? error.message : String(error)]
      });
    }
  }

  // Generate index.html with latest post
  if (publicPosts.length > 0) {
    generateIndexPage(publicPosts, outputDir, config);
  }

  return result;
}
