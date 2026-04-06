import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const notesCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    group: z.string().optional(),
    image: z.string().optional(),
    pageTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    odorProfile: z.string().optional(),
    origin: z.string().optional(),
    extraction: z.string().optional(),
    seasonality: z.string().optional(),
  }),
});

export const collections = {
  notes: notesCollection,
};
