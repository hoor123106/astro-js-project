import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1wO4CUEz6BHSnbwSQLy3HqGhPXAdyubLfFdS7KpLI67E/export?format=csv&gid=1876307699';

function escapeMDX(str) {
  if (!str) return '';
  return str.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
}

function sanitizeHtmlForMDX(str) {
  if (!str) return '';
  let out = str.replace(/<!--\s*\/?wp:[^>]*-->\s*/g, '');
  out = out.replace(/<!DOCTYPE[^>]*>\s*/gi, '');

  out = out.replace(/<img\b([^>]*)>/gi, (match, attrs) => (match.endsWith('/>') ? match : `<img${attrs} />`));
  out = out.replace(/<br\b([^>]*)>/gi, (match, attrs) => (match.endsWith('/>') ? match : `<br${attrs} />`));
  out = out.replace(/<hr\b([^>]*)>/gi, (match, attrs) => (match.endsWith('/>') ? match : `<hr${attrs} />`));

  return out;
}

async function fetchAndGenerate() {
  console.log('Fetching Blog Sheet data...');
  const response = await fetch(SHEET_URL);
  const csvText = await response.text();

  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
  });

  const contentDir = path.join(process.cwd(), 'src', 'content', 'blogs');

  if (fs.existsSync(contentDir)) {
    console.log('Cleaning old blog MDX files...');
    const files = fs.readdirSync(contentDir);
    for (const file of files) {
      if (file.endsWith('.mdx')) fs.unlinkSync(path.join(contentDir, file));
    }
  } else {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  records.forEach((row, index) => {
    let slug = row['Slug']?.trim();

    if (!slug && row['Permalink']) {
      try {
        const urlObj = new URL(row['Permalink']);
        slug = urlObj.pathname.split('/').filter(Boolean).pop();
      } catch (e) {}
    }

    slug = (slug || `blog-${index}`).replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
    if (!slug) return;

    if (row['Status'] && row['Status'].trim() !== 'publish') return;

    const frontmatter = {
      title: row['Title'] || '',
      slug: slug,
      date: row['Date'] || '',
      postModifiedDate: row['Post Modified Date'] || '',
      excerpt: row['Excerpt'] || '',
      categories: row['Categories'] || '',
      tags: row['Tags'] || '',
      authorUsername: row['Author Username'] || '',
      authorFirstName: row['Author First Name'] || '',
      authorLastName: row['Author Last Name'] || '',
      authorEmail: row['Author Email'] || '',
      permalink: row['Permalink'] || '',
      postType: row['Post Type'] || '',
    };

    let mdxContent = `---\n`;
    for (const [key, value] of Object.entries(frontmatter)) {
      mdxContent += `${key}: ${JSON.stringify(value)}\n`;
    }
    mdxContent += `---\n\n`;

    if (row['Content']) {
      const cleaned = sanitizeHtmlForMDX(row['Content'], { alt: frontmatter.title });
      mdxContent += `${escapeMDX(cleaned)}\n\n`;
    }

    const filePath = path.join(contentDir, `${slug}.mdx`);
    fs.writeFileSync(filePath, mdxContent, 'utf-8');
    console.log(`Created: ${slug}.mdx`);
  });

  console.log('Blog sync complete.');
}

fetchAndGenerate().catch(console.error);