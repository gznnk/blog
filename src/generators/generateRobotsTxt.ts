import * as path from 'path';
import * as fs from 'fs';
import { SiteConfig } from '../types/config';
import { renderTemplate } from '../utils/templateEngine';

/**
 * Generate robots.txt for SEO
 */
export function generateRobotsTxt(outputDir: string, config: SiteConfig): void {
  const baseUrl = `https://${config.siteDomain}${config.basePath}`;

  const content = renderTemplate('robots.njk', {
    siteName: config.siteName,
    baseUrl
  });

  const outputPath = path.join(outputDir, 'robots.txt');
  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log('Generated robots.txt');
}
