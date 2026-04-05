import { z, defineCollection } from 'astro:content';

const notesCollection = defineCollection({
  type: 'content',
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
