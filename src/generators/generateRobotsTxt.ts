import * as path from 'path';
import * as fs from 'fs';
import { SiteConfig } from '../types/config';

/**
 * Generate robots.txt for SEO
 */
export function generateRobotsTxt(outputDir: string, config: SiteConfig): void {
  const baseUrl = `https://${config.siteDomain}${config.basePath}`;

  let content = '# robots.txt for ' + config.siteName + '\n\n';
  content += 'User-agent: *\n';
  content += 'Allow: /\n\n';
  content += `Sitemap: ${baseUrl}/sitemap.xml\n`;

  const outputPath = path.join(outputDir, 'robots.txt');
  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log('Generated robots.txt');
}
