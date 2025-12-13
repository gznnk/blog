import * as nunjucks from 'nunjucks';
import * as path from 'path';

// Configure Nunjucks once
const templatesPath = path.join(__dirname, '../templates');
const env = nunjucks.configure(templatesPath, {
  autoescape: true,
  noCache: true
});

export function renderTemplate(templateName: string, context: Record<string, any>): string {
  return env.render(templateName, context);
}
