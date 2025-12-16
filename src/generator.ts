import * as path from 'path';
import * as fs from 'fs';
import { findMarkdownFiles } from './utils/findMarkdownFiles';
import { extractPostMetadata, generatePostHtml, PostMetadata } from './generators/processPost';
import { generateIndexPage } from './generators/generateIndexPage';
import { generateSitemap } from './generators/generateSitemap';
import { generateRobotsTxt } from './generators/generateRobotsTxt';
import { generateRssFeed } from './generators/generateRssFeed';
import { loadConfig } from './utils/loadConfig';
import { loadI18n } from './utils/loadI18n';
import { renderTemplate } from './utils/templateEngine';
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

  // Load i18n configuration
  const i18n = loadI18n();

  // Find all markdown files in content/posts/YYYY/MM/DD/*.md
  const postsDir = path.join(contentDir, 'posts');

  if (!fs.existsSync(postsDir)) {
    console.error(`Posts directory not found: ${postsDir}`);
    return result;
  }

  const markdownFiles = findMarkdownFiles(postsDir);
  const publicPosts: PostMetadata[] = [];

  // First pass: collect all post metadata without generating HTML
  for (const filePath of markdownFiles) {
    try {
      const postMeta = extractPostMetadata(filePath, result, config.supportedLangs);
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

  // Second pass: generate HTML for all posts with sidebar data
  if (publicPosts.length > 0) {
    for (const post of publicPosts) {
      try {
        await generatePostHtml(post, contentDir, outputDir, config, publicPosts, i18n);
        result.processed++;
      } catch (error) {
        result.errors.push({
          file: post.filePath,
          errors: [error instanceof Error ? error.message : String(error)]
        });
      }
    }

    // Generate index.html for each language
    for (const lang of config.supportedLangs) {
      const langPosts = publicPosts.filter(p => p.lang === lang);
      if (langPosts.length > 0) {
        generateIndexPage(langPosts, outputDir, config, lang, i18n, contentDir);
      }
    }

    // Generate root index.html (redirect to default language)
    const rootIndexPath = path.join(outputDir, 'index.html');
    const redirectHtml = renderTemplate('redirect.njk', {
      redirectUrl: `${config.basePath}/${config.defaultLang}/`,
      lang: config.defaultLang
    });
    fs.writeFileSync(rootIndexPath, redirectHtml, 'utf-8');
    console.log(`Generated root redirect: ${rootIndexPath}`);

    // Generate SEO files for each language
    for (const lang of config.supportedLangs) {
      const langPosts = publicPosts.filter(p => p.lang === lang);
      if (langPosts.length > 0) {
        generateSitemap(langPosts, outputDir, config, lang);
        generateRssFeed(langPosts, outputDir, config, lang, i18n);
      }
    }

    // Generate robots.txt (common for all languages)
    generateRobotsTxt(outputDir, config);
  }

  return result;
}
