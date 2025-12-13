import { escapeHtml } from '../utils/escapeHtml';
import { PostMetadata } from '../generators/processPost';

export function generateIndexLayout(
  latestPost: PostMetadata,
  contentHtml: string
): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${escapeHtml(latestPost.description)}">
    <title>${escapeHtml(latestPost.title)}</title>
</head>
<body>
    <header>
        <nav>
            <a href="/">Home</a>
        </nav>
    </header>
    <main>
        <article>
            <h1>${escapeHtml(latestPost.title)}</h1>
            <time datetime="${latestPost.date}">${latestPost.date}</time>
            ${latestPost.tags && latestPost.tags.length > 0 ? `
            <div class="tags">
                ${latestPost.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join(' ')}
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
