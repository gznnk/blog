import * as nunjucks from 'nunjucks';
import * as path from 'path';
import { PostFrontmatter } from '../validator';
import { formatDate } from '../utils/formatDate';

// Configure Nunjucks
const templatesPath = path.join(__dirname, '../templates');
const env = nunjucks.configure(templatesPath, {
  autoescape: true,
  noCache: true
});

export function generatePostLayout(
  frontmatter: PostFrontmatter,
  contentHtml: string
): string {
  const { title, description, date, tags } = frontmatter;

  return env.render('post.njk', {
    title,
    description,
    lang: 'en',
    currentYear: new Date().getFullYear(),
    post: {
      title,
      description,
      date,
      formattedDate: formatDate(date),
      tags
    },
    content: contentHtml
  });
}
