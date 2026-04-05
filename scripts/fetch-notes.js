import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1VA2w8eHFEA_EYb-J-r3ddbIakQWleQ-kPWfZHlGB2RY/export?format=csv';

function escapeMDX(str) {
  if (!str) return '';
  return str.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
}

async function fetchAndGenerate() {
  console.log('Fetching Google Sheet data...');
  const response = await fetch(SHEET_URL);
  const csvText = await response.text();

  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
  });

  const contentDir = path.join(process.cwd(), 'src', 'content', 'notes');
  
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  records.forEach((row, index) => {
    let slug = row.permalink?.trim() || row['Note-Name']?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `note-${index}`;
    if (slug.startsWith('http')) {
      try {
        const urlObj = new URL(slug);
        slug = urlObj.pathname.split('/').filter(Boolean).pop();
      } catch(e) {}
    }
    slug = (slug || `note-${index}`).replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
    if (!slug) return;

    const frontmatter = {
      title: row['Note-Name'] || '',
      group: row.Group || '',
      image: row['notes-image.webp'] || '',
      pageTitle: row['Page-Title'] || '',
      metaDescription: row['Meta-Description'] || '',
      odorProfile: row['Odor-Profile'] || ''
    };

    let mdxContent = `---\n`;
    for (const [key, value] of Object.entries(frontmatter)) {
      mdxContent += `${key}: ${JSON.stringify(value)}\n`;
    }
    mdxContent += `---\n\n`;

    if (row.History) {
      mdxContent += `## History\n\n${escapeMDX(row.History)}\n\n`;
    }
    if (row['Famous-Perfumes']) {
      mdxContent += `## Famous Perfumes\n\n${escapeMDX(row['Famous-Perfumes'])}\n\n`;
    }
    if (row.origin) {
      mdxContent += `## Origin\n\n${escapeMDX(row.origin)}\n\n`;
    }
    if (row.extraction) {
      mdxContent += `## Extraction\n\n${escapeMDX(row.extraction)}\n\n`;
    }
    if (row['extraction-method']) {
        mdxContent += `## Extraction Method\n\n${escapeMDX(row['extraction-method'])}\n\n`;
    }
    if (row.trivia) {
        mdxContent += `## Trivia\n\n${escapeMDX(row.trivia)}\n\n`;
    }
    if (row.sustanability) {
        mdxContent += `## Sustainability\n\n${escapeMDX(row.sustanability)}\n\n`;
    }
    if (row.seasonality) {
        // Strip out li and ul tags 
        const cleanedSeasonality = row.seasonality.replace(/<\/?(li|ul)[^>]*>/gi, '').trim();
        mdxContent += `## Seasonality\n\n${escapeMDX(cleanedSeasonality)}\n\n`;
    }
    if (row['Top Perfumes']) {
        mdxContent += `## Top Perfumes\n\n${escapeMDX(row['Top Perfumes'])}\n\n`;
    }
    if (row.faq) {
        let faqHTML = row.faq;
        let scriptBlock = '';
        
        const match = faqHTML.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
        if (match) {
            faqHTML = faqHTML.replace(match[0], '').trim();
            scriptBlock = `\n\n<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ${JSON.stringify(match[1])} }} />\n\n`;
            
            // If the user only provided the JSON script in the sheet, generate visual text from it automatically
            if (!faqHTML) {
                try {
                    const parsedData = JSON.parse(match[1].trim());
                    if (parsedData.mainEntity && Array.isArray(parsedData.mainEntity)) {
                        parsedData.mainEntity.forEach(item => {
                            faqHTML += `<p><strong>Q: ${item.name}</strong><br/>A: ${item.acceptedAnswer.text}</p>\n`;
                        });
                    }
                } catch(e) {
                    // Ignore JSON parse errors
                }
            }
        }
        
        if (faqHTML || scriptBlock) {
            mdxContent += `## FAQ\n\n<div class="faq-section">\n${escapeMDX(faqHTML)}\n</div>${scriptBlock}\n\n`;
        }
    }

    const filePath = path.join(contentDir, `${slug}.mdx`);
    fs.writeFileSync(filePath, mdxContent, 'utf-8');
    console.log(`Created: ${slug}.mdx`);
  });

  console.log('Google Sheet sync complete.');
}

fetchAndGenerate().catch(console.error);
