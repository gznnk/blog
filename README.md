# blog
Minimal static blog generator (Markdown → HTML) for GitHub Pages

## Features

- **Node.js + TypeScript** static blog generator
- **Markdown to HTML** conversion with frontmatter support
- **Validation**: Required fields, date format, and folder structure
- **Draft support**: Skip posts marked as drafts
- **Clean output**: Organized HTML structure with shared layout

## Installation

```bash
npm install
```

## Usage

1. Create your blog posts in `content/posts/YYYY/MM/DD/slug.md`
2. Add YAML frontmatter with required fields
3. Run the generator:

```bash
npm run generate
```

Generated HTML files will be in `dist/posts/YYYY/MM/DD/slug/index.html`

## Post Format

Each post must be a Markdown file with YAML frontmatter:

```markdown
---
title: My Blog Post Title
date: 2024-01-15
description: A brief description of the post
tags:
  - web
  - tutorial
draft: false
---

# Your Content Here

Write your blog post in Markdown...
```

### Required Fields

- `title` (string): The post title
- `date` (string): Publication date in YYYY-MM-DD format
- `description` (string): Brief description for meta tags

### Optional Fields

- `tags` (array): List of tags
- `draft` (boolean): Set to `true` to skip during generation

### Validation Rules

1. All required fields must be present
2. Date must be in YYYY-MM-DD format
3. Folder date must match frontmatter date
4. Posts with `draft: true` are skipped

## Project Structure

```
blog/
├── content/
│   └── posts/
│       └── YYYY/
│           └── MM/
│               └── DD/
│                   └── slug.md
├── dist/
│   └── posts/
│       └── YYYY/
│           └── MM/
│               └── DD/
│                   └── slug/
│                       └── index.html
├── src/
│   ├── generator.ts    # Main generation logic
│   ├── validator.ts    # Post validation
│   ├── layout.ts       # HTML layout templates
│   └── index.ts        # CLI entry point
└── package.json
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run generate` - Build and generate the blog

## Output

Each post generates an HTML file with:
- **Header**: Navigation bar
- **Main**: Article content with title, date, tags, and converted Markdown
- **Footer**: Copyright notice

The Markdown content is converted to HTML and placed inside an `<article>` tag.

