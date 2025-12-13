import { PostFrontmatter } from './validator';

export function generateLayout(
  frontmatter: PostFrontmatter,
  contentHtml: string
): string {
  const { title, description, date, tags } = frontmatter;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${escapeHtml(description)}">
    <title>${escapeHtml(title)}</title>
</head>
<body>
    <header>
        <nav>
            <a href="/">Home</a>
        </nav>
    </header>
    <main>
        <article>
            <h1>${escapeHtml(title)}</h1>
            <time datetime="${date}">${formatDate(date)}</time>
            ${tags && tags.length > 0 ? `
            <div class="tags">
                ${tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join(' ')}
            </div>` : ''}
            ${contentHtml}
        </article>
    </main>
    <footer>
        <p>&copy; ${new Date().getFullYear()}</p>
    </footer>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}
