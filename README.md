# Knowledge as Code

A personal repository that explores **Knowledge as Code** —
treating knowledge as something that can be written, versioned,
built, and published in the same way as software.

In this repository, knowledge is written in **Markdown**, edited in a
developer-friendly environment (VS Code), managed with Git, and
**automatically built and published as a static website via CI/CD**.

This is not simply a blog.

It is an ongoing experiment in whether engineers can:
- Write knowledge and ideas alongside code, using familiar tools and workflows
- Collaborate with **coding agents** through natural language inside the IDE
- Investigate how **Vibe Coding** can accelerate and lower the barrier to
  practicing **Knowledge as Code** by reducing friction in writing,
  structuring, and publishing knowledge

Articles, code, generators, and experiments in this repository all serve
a single question:

**Can knowledge be evolved, reviewed, and deployed as reliably as software?**

## Features

- **Node.js + TypeScript** static blog generator
- **Markdown to HTML** conversion with frontmatter support
- **Validation**: Required fields, date format, and folder structure
- **Draft support**: Skip posts marked as drafts
- **Clean output**: Organized HTML structure with shared layout

## GitHub Pages Setup (Required)

This project uses **GitHub Actions** to deploy the generated static files to GitHub Pages.

Before deployment, configure the repository as follows:

1. Go to **Repository Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Save the settings

No `gh-pages` branch is required.
The build output directory must be `dist/`.

Once configured, pushing to the `main` branch will automatically:
- Build the blog
- Upload the generated files
- Deploy them to GitHub Pages

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

### Local Preview

To preview the generated blog locally:

```bash
npm run preview
```

This starts a local server at http://localhost:3000 to view your blog.

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
- `npm run preview` - Start local preview server at http://localhost:3000

## Output

Each post generates an HTML file with:
- **Header**: Navigation bar
- **Main**: Article content with title, date, tags, and converted Markdown
- **Footer**: Copyright notice

The Markdown content is converted to HTML and placed inside an `<article>` tag.

## License

The source code in this repository is licensed under the MIT License.

All articles and contents under the `content/` directory are
© 2025 gznnk. All rights reserved.