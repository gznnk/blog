import * as nunjucks from 'nunjucks';
import * as path from 'path';
import { PostMetadata } from '../generators/processPost';

// Configure Nunjucks
const templatesPath = path.join(__dirname, '../templates');
const env = nunjucks.configure(templatesPath, {
  autoescape: true,
  noCache: true
});

export function generateIndexLayout(
  latestPost: PostMetadata,
  contentHtml: string
): string {
  return env.render('index.njk', {
    title: latestPost.title,
    description: latestPost.description,
    lang: 'ja',
    currentYear: new Date().getFullYear(),
    post: latestPost,
    content: contentHtml
  });
}
