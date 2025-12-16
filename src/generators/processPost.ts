import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { validatePost, PostFrontmatter } from '../validator';
import { renderTemplate } from '../utils/templateEngine';
import { formatDate } from '../utils/formatDate';
import { SiteConfig, I18nConfig } from '../types/config';
import { generatePostList } from '../utils/postList';

export interface PostMetadata {
  title: string;
  date: string;
  description: string;
  lang: string;
  tags?: string[];
  filePath: string;
  content: string;
  frontmatter: PostFrontmatter;
}

export interface ProcessResult {
  processed: number;
  skipped: number;
  errors: { file: string; errors: string[] }[];
}

/**
 * Extract metadata from a post file without generating HTML
 */
export function extractPostMetadata(
  filePath: string,
  result: ProcessResult,
  supportedLangs: string[] = ['ja', 'en']
): PostMetadata | null {
  // Read and parse the markdown file
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);

  // Check if draft
  if (frontmatter.draft === true) {
    console.log(`Skipping draft: ${filePath}`);
    result.skipped++;
    return null;
  }

  // Normalize date to string format (gray-matter may parse it as Date object)
  if (frontmatter.date instanceof Date) {
    const year = frontmatter.date.getFullYear();
    const month = String(frontmatter.date.getMonth() + 1).padStart(2, '0');
    const day = String(frontmatter.date.getDate()).padStart(2, '0');
    frontmatter.date = `${year}-${month}-${day}`;
  }

  // Validate the post
  const validation = validatePost(frontmatter, filePath, supportedLangs);

  if (!validation.valid) {
    result.errors.push({
      file: filePath,
      errors: validation.errors.map(e => `${e.field}: ${e.message}`)
    });
    return null;
  }

  // Return metadata without generating HTML
  return {
    title: frontmatter.title as string,
    date: frontmatter.date as string,
    description: frontmatter.description as string,
    lang: frontmatter.lang as string,
    tags: frontmatter.tags as string[] | undefined,
    filePath,
    content,
    frontmatter: frontmatter as PostFrontmatter
  };
}

/**
 * Generate HTML for a post
 */
export async function generatePostHtml(
  post: PostMetadata,
  contentDir: string,
  outputDir: string,
  config: SiteConfig,
  allPosts: PostMetadata[],
  i18n: I18nConfig
): Promise<void> {
  // Convert markdown to HTML
  const contentHtml = await marked(post.content);

  // Prepare post list for sidebar (filtered by language)
  const postList = generatePostList(allPosts, config, post.lang);

  // Extract URL path from input path
  // Input: content/posts/YYYY/MM/DD/lang/slug.md
  // Output URL: /lang/posts/YYYY/MM/DD/slug/
  const relativePath = path.relative(path.join(contentDir, 'posts'), post.filePath);
  const parsedPath = path.parse(relativePath);
  // Remove the lang directory from the path
  const pathParts = parsedPath.dir.split(path.sep);
  const langIndex = pathParts.findIndex(p => p === post.lang);
  const pathWithoutLang = [...pathParts.slice(0, langIndex), ...pathParts.slice(langIndex + 1)].join('/');
  const urlPath = `${post.lang}/posts/${pathWithoutLang}/${parsedPath.name}`.replace(/\\/g, '/');
  const canonicalUrl = `https://${config.siteDomain}${config.basePath}/${urlPath}/`;

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

  // Find alternative language version for language switcher
  const altLang = post.lang === 'ja' ? 'en' : 'ja';
  const altLangPost = allPosts.find(p =>
    p.lang === altLang &&
    p.date === post.date &&
    p.filePath.split(path.sep).pop() === post.filePath.split(path.sep).pop()
  );
  const altLangUrl = altLangPost
    ? `${config.basePath}/${altLang}/posts/${pathWithoutLang}/${parsedPath.name}/`
    : `${config.basePath}/${altLang}/`;

  // For translated articles (en), find the original article (ja)
  let originalLangUrl: string | undefined;
  if (post.lang === 'en') {
    const originalPost = allPosts.find(p =>
      p.lang === 'ja' &&
      p.date === post.date &&
      p.filePath.split(path.sep).pop() === post.filePath.split(path.sep).pop()
    );
    if (originalPost) {
      originalLangUrl = `${config.basePath}/ja/posts/${pathWithoutLang}/${parsedPath.name}/`;
    }
  }

  // Generate full HTML with template
  const { title, description, date, tags, lang } = post;
  const html = renderTemplate('post.njk', {
    title: `${title} - ${config.siteName}`,
    description,
    lang,
    currentYear: new Date().getFullYear(),
    siteName: config.siteName,
    basePath: config.basePath,
    author: config.author,
    avatarUrl: config.avatarUrl,
    githubUrl: config.githubUrl,
    repositoryUrl: config.repositoryUrl,
    twitterUrl: config.twitterUrl,
    canonicalUrl,
    ogTitle: title,
    ogDescription: description,
    ogType: 'article',
    ogImage,
    post: {
      title,
      description,
      date,
      formattedDate: formatDate(date),
      tags
    },
    content: contentHtml,
    posts: postList,
    currentLang: lang,
    altLang,
    altLangUrl,
    originalLangUrl,
    i18n: i18n[lang]
  });

  // Extract output path from relative path
  // Input: content/posts/YYYY/MM/DD/lang/slug.md
  // Output: dist/lang/posts/YYYY/MM/DD/slug/index.html
  const outputPath = path.join(
    outputDir,
    lang,
    'posts',
    pathWithoutLang,
    parsedPath.name,
    'index.html'
  );

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  // Write the HTML file
  fs.writeFileSync(outputPath, html, 'utf-8');

  console.log(`Generated: ${outputPath}`);
}
