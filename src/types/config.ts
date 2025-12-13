/**
 * Site configuration structure
 */
export interface SiteConfig {
  siteName: string;
  siteDescription: string;
  siteDomain: string;
  basePath: string;
  author: string;
  avatarUrl?: string;
  bio?: string;
  githubUrl?: string;
  sidebarMaxItems: number;
  rssMaxItems: number;
  timezone: string;
}
