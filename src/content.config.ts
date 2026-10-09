import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";
import noteMetadata from "./content/note-metadata.json";

export const BLOG_PATH = "src/content/projects";

const projects = defineCollection({
  loader: glob({
    pattern: "*/index.{md,mdx}",
    base: `./${BLOG_PATH}`,
    generateId: ({ entry }) => entry.split("/")[0],
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(0),
    repository: z.url().optional(),
    demo: z.url().optional(),
  }),
});

const notesGlob = glob({
  pattern: "*/notes/**/[^_]*.{md,mdx}",
  base: `./${BLOG_PATH}`,
  generateId: ({ entry }) =>
    entry.replace(/\/index\.mdx?$/, "").replace(/\.mdx?$/, ""),
});

const importedMetadata: Record<string, Record<string, unknown>> = noteMetadata;

const posts = defineCollection({
  loader: {
    name: "project-notes-with-metadata",
    async load(context) {
      await notesGlob.load({
        ...context,
        generateDigest: contents =>
          context.generateDigest({ contents, metadata: importedMetadata }),
        parseData: options =>
          context.parseData({
            ...options,
            data: { ...importedMetadata[options.id], ...options.data },
          }),
      });
    },
  },
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.coerce.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

export const collections = { projects, posts, pages };
