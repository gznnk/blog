/**
 * i18n text translations
 */
export interface I18nTexts {
  siteDescription: string;
  bio?: string;
  recentPosts: string;
  translationNotice?: string | null;
  originalArticle?: string | null;
}

/**
 * i18n configuration
 */
export type I18nConfig = Record<string, I18nTexts>;

/**
 * Site configuration structure
 */
export interface SiteConfig {
  siteName: string;
  siteDomain: string;
  basePath: string;
  timezone: string;
  author: string;
  avatarUrl?: string;
  ogImage?: string;
  favicon?: string;
  githubUrl?: string;
  repositoryUrl?: string;
  twitterUrl?: string;
  cloudflareAnalyticsToken?: string;
  sidebarMaxItems: number;
  rssMaxItems: number;
  defaultLang: string;
  supportedLangs: string[];
}
