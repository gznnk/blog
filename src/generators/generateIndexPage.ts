import * as fs from 'fs';
import * as path from 'path';
import { marked } from 'marked';
import { renderTemplate } from '../utils/templateEngine';
import { PostMetadata } from './processPost';
import { SiteConfig, I18nConfig } from '../types/config';
import { generatePostList } from '../utils/postList';
import { formatDate } from '../utils/formatDate';

export function generateIndexPage(posts: PostMetadata[], outputDir: string, config: SiteConfig, lang: string, i18n: I18nConfig): void {
  // Find the latest post (max date) for this language
  const latestPost = posts.reduce((latest, current) => {
    return current.date > latest.date ? current : latest;
  });

  console.log(`Latest post (${lang}): ${latestPost.title} (${latestPost.date})`);

  // Generate HTML for the latest post content
  const contentHtml = marked(latestPost.content) as string;

  // Generate post list for sidebar (filtered by language)
  const postList = generatePostList(posts, config, lang);

  // Generate canonical URL for top page
  const canonicalUrl = `https://${config.siteDomain}${config.basePath}/${lang}/`;

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

  // Alternative language URL for language switcher
  const altLang = lang === 'ja' ? 'en' : 'ja';
  const altLangUrl = `${config.basePath}/${altLang}/`;

  // Generate index.html using template
  const html = renderTemplate('index.njk', {
    title: config.siteName,
    description: i18n[lang].siteDescription,
    lang,
    currentYear: new Date().getFullYear(),
    siteName: config.siteName,
    basePath: config.basePath,
    author: config.author,
    avatarUrl: config.avatarUrl,
    githubUrl: config.githubUrl,
    twitterUrl: config.twitterUrl,
    canonicalUrl,
    ogType: 'website',
    ogImage,
    post: {
      ...latestPost,
      formattedDate: formatDate(latestPost.date)
    },
    content: contentHtml,
    posts: postList,
    currentLang: lang,
    altLang,
    altLangUrl,
    i18n: i18n[lang]
  });

  const indexPath = path.join(outputDir, lang, 'index.html');
  fs.mkdirSync(path.dirname(indexPath), { recursive: true });
  fs.writeFileSync(indexPath, html, 'utf-8');
  console.log(`Generated: ${indexPath}`);
}
