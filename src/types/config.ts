/**
 * Site configuration structure
 */
export interface SiteConfig {
  siteName: string;
  siteDescription: string;
  siteDomain: string;
  basePath: string;
  timezone: string;
  author: string;
  avatarUrl?: string;
  ogImage?: string;
  favicon?: string;
  bio?: string;
  githubUrl?: string;
  twitterUrl?: string;
  cloudflareAnalyticsToken?: string;
  sidebarMaxItems: number;
  rssMaxItems: number;
}
