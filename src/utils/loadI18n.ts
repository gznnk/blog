import * as fs from 'fs';
import * as path from 'path';
import { I18nConfig } from '../types/config';

/**
 * Load i18n configuration from i18n.config.json
 */
export function loadI18n(): I18nConfig {
  const configPath = path.join(process.cwd(), 'i18n.config.json');

  if (!fs.existsSync(configPath)) {
    throw new Error(`i18n config file not found: ${configPath}`);
  }

  const configContent = fs.readFileSync(configPath, 'utf-8');
  const i18n = JSON.parse(configContent) as I18nConfig;

  return i18n;
}
