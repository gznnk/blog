/**
 * Site configuration structure
 */
export interface SiteConfig {
  siteName: string;
  siteDescription: string;
  siteDomain: string;
  basePath: string;
  author: string;
  sidebarMaxItems: number;
  rssMaxItems: number;
  timezone: string;
}
