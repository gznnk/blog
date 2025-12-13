import * as fs from "fs";
import * as path from "path";
import { SiteConfig } from "../types/config";

/**
 * Load site configuration from site.config.json
 */
export function loadConfig(): SiteConfig {
  const configPath = path.join(process.cwd(), "site.config.json");

  if (!fs.existsSync(configPath)) {
    throw new Error(
      `Configuration file not found: ${configPath}\n` +
      `Please create site.config.json in the project root.`
    );
  }

  const configContent = fs.readFileSync(configPath, "utf-8");
  const config = JSON.parse(configContent) as SiteConfig;

  // Validate required fields
  const requiredFields: (keyof SiteConfig)[] = [
    "siteName",
    "siteDescription",
    "siteDomain",
    "author",
    "sidebarMaxItems",
    "rssMaxItems",
    "timezone",
  ];

  for (const field of requiredFields) {
    if (config[field] === undefined || config[field] === null) {
      throw new Error(
        `Required configuration field "${field}" is missing in site.config.json`
      );
    }
  }

  return config;
}
