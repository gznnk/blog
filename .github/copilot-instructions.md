# GitHub Copilot Custom Instructions

This repository is a **Knowledge as Code** experiment — treating knowledge as something that can be written, versioned, built, and published like software. It's a minimal static blog generator built with Node.js and TypeScript that converts Markdown to HTML and deploys to GitHub Pages.

## Project Overview

- **Purpose**: Static blog generator (Markdown → HTML) for GitHub Pages
- **Languages**: TypeScript (ES2020), strict mode enabled
- **Runtime**: Node.js
- **Build System**: TypeScript compiler (`tsc`)
- **Template Engine**: Nunjucks with autoescape enabled
- **Markdown Parser**: marked (with gray-matter for frontmatter)

## Directory Structure

```
blog/
├── content/
│   ├── posts/YYYY/MM/DD/{lang}/slug.md  # Blog posts organized by date and language
│   └── sections/{lang}/*.md              # Site descriptions
├── public/                                # Build output (generated, git-ignored)
│   └── {lang}/posts/YYYY/MM/DD/slug/index.html
├── src/
│   ├── generator.ts                      # Main generation logic
│   ├── validator.ts                      # Post validation
│   ├── generators/                       # Individual generators (index, sitemap, RSS, etc.)
│   ├── utils/                            # Utility functions
│   ├── templates/                        # Nunjucks templates
│   └── types/                            # TypeScript type definitions
├── dist/                                  # Compiled JavaScript (generated, git-ignored)
└── package.json
```

## Build and Test Commands

- **Build**: `npm run build` - Compiles TypeScript to JavaScript
- **Generate**: `npm run generate` - Builds and generates the blog
- **Preview**: `npm run preview` - Generates and serves locally at http://localhost:3000
- **Test**: No automated tests currently configured

## Coding Style and Conventions

### TypeScript
- Use **strict mode** (all strict checks enabled in tsconfig.json)
- Target: **ES2020**
- Module system: **CommonJS**
- Always use explicit types where possible
- Use interfaces for object shapes
- Prefer `const` over `let`, avoid `var`
- Use semicolons to end statements
- Use single quotes for strings

### File Organization
- One main export per file when appropriate
- Group related functionality in dedicated directories (utils, generators, types)
- Use descriptive file names in kebab-case or camelCase

### Import Style
- Import Node.js core modules with `* as` syntax: `import * as path from 'path';`
- Import specific named exports for local modules: `import { generateBlog } from './generator';`
- Keep imports organized: core modules first, then third-party, then local

### Error Handling
- Use structured error objects with meaningful messages
- Collect validation errors instead of failing fast
- Log errors to console with context
- Exit with code 1 on fatal errors

### Code Comments
- Add comments sparingly, only for complex logic
- Prefer self-documenting code with clear variable and function names
- Use JSDoc-style comments for public APIs

## Blog Post Requirements

### Frontmatter (YAML)
Required fields:
- `title` (string): Post title
- `date` (string): Publication date in YYYY-MM-DD format
- `description` (string): Brief description for meta tags
- `lang` (string): Language code (`ja` or `en`)

Optional fields:
- `tags` (array): List of tags
- `draft` (boolean): Set to `true` to skip during generation

### File Structure Rules
1. Posts must be in `content/posts/YYYY/MM/DD/{lang}/slug.md`
2. Folder date must match frontmatter date
3. Folder lang must match frontmatter lang
4. Supported languages: `ja` (Japanese) and `en` (English)
5. Posts marked as `draft: true` are skipped during generation

### Validation
- All validations are implemented in `src/validator.ts`
- Validation runs before HTML generation
- Errors are collected and reported at the end of generation

## Security Guidelines

- Never commit secrets or sensitive data
- Use Nunjucks autoescape for all template rendering (already configured)
- Validate and sanitize external input (frontmatter data)
- Use `escapeHtml()` utility for additional HTML escaping when needed
- Never use `eval()` or `Function()` constructors
- Be careful with file path operations to prevent path traversal

## Dependencies

### Production
- `gray-matter`: Parse YAML frontmatter from Markdown
- `marked`: Convert Markdown to HTML
- `nunjucks`: Template engine for HTML generation

### Development
- `typescript`: TypeScript compiler
- `@types/node`: Node.js type definitions
- `@types/nunjucks`: Nunjucks type definitions
- `live-server`: Local development server
- `serve`: Alternative development server

### Adding New Dependencies
- Prefer well-maintained, popular packages
- Check for security vulnerabilities before adding
- Keep dependencies minimal
- Add types when available (`@types/*` packages)

## Output Requirements

- Build output goes to `public/` directory
- Generated files should not be committed (ignored in `.gitignore`)
- HTML structure: header → main → footer
- Include proper meta tags and Open Graph tags
- Generate sitemap.xml, robots.txt, and RSS feed per language

## Configuration Files

- `site.config.json`: Site-wide configuration (name, URL, description, languages)
- `i18n.config.json`: Internationalization strings
- `tsconfig.json`: TypeScript compiler options
- `.gitignore`: Excludes node_modules, dist, public, and logs

## Deployment

- Uses GitHub Actions (`.github/workflows/deploy-pages.yml`)
- Automatically deploys to GitHub Pages on push to `main` branch
- GitHub Pages must be configured to use GitHub Actions as source

## Documentation

- Keep README.md up to date with user-facing instructions
- Update SPEC.md (in Japanese) if changing core behavior
- Document breaking changes prominently
- Include examples in documentation

## Special Considerations

- This is a **multilingual blog**: Always consider both `ja` and `en` languages
- Date handling: gray-matter may parse dates as Date objects; normalize to YYYY-MM-DD strings
- Path safety: Always use `path.join()` for file paths, never string concatenation
- Console logging: Use clear, structured console output with emoji (✓, ✗) when appropriate

## When Making Changes

1. Understand the existing code patterns before making changes
2. Follow the established directory structure
3. Keep changes minimal and focused
4. Ensure TypeScript compiles without errors (`npm run build`)
5. Test the generation process (`npm run generate`)
6. Preview the output (`npm run preview`)
7. Update documentation if adding new features
8. Consider impact on both Japanese and English content
