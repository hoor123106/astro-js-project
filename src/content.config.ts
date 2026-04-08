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
  }),
});

const blogsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blogs' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    date: z.string().optional(),
    postModifiedDate: z.string().optional(),
    excerpt: z.string().optional(),
    categories: z.string().optional(),
    tags: z.string().optional(),
    authorUsername: z.string().optional(),
    authorFirstName: z.string().optional(),
    authorLastName: z.string().optional(),
    authorEmail: z.string().optional(),
    permalink: z.string().optional(),
    postType: z.string().optional(),
  }),
});

const perfumeCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/perfume' }),
  schema: z.object({
    perfumeName: z.string(),
    slug: z.string().optional(),
    year: z.string().optional(),
    use: z.string().optional(),
    productPageUrl: z.string().optional(),
    imageUrl: z.string().optional(),
    collectionName: z.string().optional(),
    brandName: z.string().optional(),
    topNotes: z.string().optional(),
    middleNotes: z.string().optional(),
    baseNotes: z.string().optional(),
    pros: z.string().optional(),
    cons: z.string().optional(),
    openingSentence: z.string().optional(),
  }),
});

export const collections = {
  notes: notesCollection,
  blogs: blogsCollection,
  perfume: perfumeCollection,
};