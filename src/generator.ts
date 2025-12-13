import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { validatePost, PostFrontmatter } from './validator';
import { generateLayout } from './layout';

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

  // Find all markdown files in content/posts/YYYY/MM/DD/*.md
  const postsDir = path.join(contentDir, 'posts');
  
  if (!fs.existsSync(postsDir)) {
    console.error(`Posts directory not found: ${postsDir}`);
    return result;
  }

  const markdownFiles = findMarkdownFiles(postsDir);
  
  for (const filePath of markdownFiles) {
    try {
      await processPost(filePath, contentDir, outputDir, result);
    } catch (error) {
      result.errors.push({
        file: filePath,
        errors: [error instanceof Error ? error.message : String(error)]
      });
    }
  }

  return result;
}

function findMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  
  function traverse(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

async function processPost(
  filePath: string,
  contentDir: string,
  outputDir: string,
  result: GenerateResult
): Promise<void> {
  // Read and parse the markdown file
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);

  // Check if draft
  if (frontmatter.draft === true) {
    console.log(`Skipping draft: ${filePath}`);
    result.skipped++;
    return;
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
    return;
  }

  // Convert markdown to HTML
  const contentHtml = await marked(content);

  // Generate full HTML with layout
  const html = generateLayout(frontmatter as PostFrontmatter, contentHtml);

  // Extract output path from input path
  // Input: content/posts/YYYY/MM/DD/slug.md
  // Output: dist/posts/YYYY/MM/DD/slug/index.html
  const relativePath = path.relative(path.join(contentDir, 'posts'), filePath);
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
  result.processed++;
}
