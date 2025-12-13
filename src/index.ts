#!/usr/bin/env node
import * as path from 'path';
import * as fs from 'fs';
import { generateBlog } from './generator';

async function main() {
  const contentDir = path.join(process.cwd(), 'content');
  const outputDir = path.join(process.cwd(), 'dist');

  console.log('Starting blog generation...');
  console.log(`Content directory: ${contentDir}`);
  console.log(`Output directory: ${outputDir}`);

  const result = await generateBlog(contentDir, outputDir);

  // Create .nojekyll file to disable Jekyll processing on GitHub Pages
  const nojekyllPath = path.join(outputDir, '.nojekyll');
  fs.writeFileSync(nojekyllPath, '', 'utf-8');
  console.log('Created .nojekyll file for GitHub Pages');

  console.log('\n=== Generation Complete ===');
  console.log(`Processed: ${result.processed}`);
  console.log(`Skipped: ${result.skipped}`);
  
  if (result.errors.length > 0) {
    console.log(`\nErrors (${result.errors.length}):`);
    for (const error of result.errors) {
      console.log(`  ${error.file}:`);
      for (const msg of error.errors) {
        console.log(`    - ${msg}`);
      }
    }
    process.exit(1);
  }

  console.log('\n✓ All posts generated successfully!');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
