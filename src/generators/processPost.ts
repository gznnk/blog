import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { validatePost, PostFrontmatter } from '../validator';
import { renderTemplate } from '../utils/templateEngine';
import { formatDate } from '../utils/formatDate';
import { SiteConfig } from '../types/config';
import { generatePostList } from '../utils/postList';

export interface PostMetadata {
  title: string;
  date: string;
  description: string;
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
  result: ProcessResult
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
  const validation = validatePost(frontmatter, filePath);

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
  allPosts: PostMetadata[]
): Promise<void> {
  // Convert markdown to HTML
  const contentHtml = await marked(post.content);

  // Prepare post list for sidebar
  const postList = generatePostList(allPosts, config);

  // Generate full HTML with template
  const { title, description, date, tags } = post;
  const html = renderTemplate('post.njk', {
    title: `${title} - ${config.siteName}`,
    description,
    lang: 'ja',
    currentYear: new Date().getFullYear(),
    siteName: config.siteName,
    basePath: config.basePath,
    author: config.author,
    post: {
      title,
      description,
      date,
      formattedDate: formatDate(date),
      tags
    },
    content: contentHtml,
    posts: postList
  });

  // Extract output path from input path
  // Input: content/posts/YYYY/MM/DD/slug.md
  // Output: dist/posts/YYYY/MM/DD/slug/index.html
  const relativePath = path.relative(path.join(contentDir, 'posts'), post.filePath);
  const parsedPath = path.parse(relativePath);
  const outputPath = path.join(
    outputDir,
    'posts',
    parsedPath.dir,
    parsedPath.name,
    'index.html'
  );

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  // Write the HTML file
  fs.writeFileSync(outputPath, html, 'utf-8');

  console.log(`Generated: ${outputPath}`);
}
