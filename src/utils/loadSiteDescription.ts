import * as fs from 'fs';
import * as path from 'path';

/**
 * Load site description content from sections/[lang]/site-descriptions.md
 */
export function loadSiteDescription(contentDir: string, lang: string): string {
  const descPath = path.join(contentDir, 'sections', lang, 'site-descriptions.md');

  if (!fs.existsSync(descPath)) {
    console.warn(`Site description not found: ${descPath}`);
    return '';
  }

  const content = fs.readFileSync(descPath, 'utf-8');
  return content;
}
