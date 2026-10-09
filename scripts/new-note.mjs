/* eslint-disable no-console -- This command reports authoring results to the terminal. */
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const [project, slug, ...titleParts] = process.argv.slice(2);
const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
if (
  !validSlug.test(project ?? "") ||
  !validSlug.test(slug ?? "") ||
  slug === "index"
) {
  console.error(
    'Usage: pnpm new:note <project> <note-slug> [title]\nExample: pnpm new:note dtt autograd "Implementing Autograd"'
  );
  process.exit(1);
}
const projectRoot = resolve(root, "src/content/projects", project);
try {
  await readFile(resolve(projectRoot, "index.md"));
} catch {
  try {
    await readFile(resolve(projectRoot, "index.mdx"));
  } catch {
    console.error(
      `Project ${project} does not exist. Create its index.md first.`
    );
    process.exit(1);
  }
}
const noteRoot = resolve(projectRoot, "notes", slug);
try {
  await access(resolve(noteRoot, "index.mdx"));
  console.error(
    `Note ${project}/${slug} already exists; nothing was overwritten.`
  );
  process.exit(1);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const title = titleParts.join(" ") || slug;
const markdown = `---
title: ${JSON.stringify(title)}
description: "Add a short description of this note."
pubDatetime: ${new Date().toISOString()}
tags: []
draft: true
---

## Table of contents

## Background

Start writing here.

## Implementation and Experiments

<!-- Place images in images/, for example: ![Description](./images/diagram.png) -->

## Conclusions and Next Steps
`;
await mkdir(noteRoot, { recursive: true });
try {
  await writeFile(resolve(noteRoot, "index.md"), markdown, { flag: "wx" });
} catch (error) {
  if (error.code === "EEXIST") {
    console.error(
      `Note ${project}/${slug} already exists; nothing was overwritten.`
    );
    process.exit(1);
  }
  throw error;
}
await mkdir(resolve(noteRoot, "images"), { recursive: true });
await writeFile(resolve(noteRoot, "images/.gitkeep"), "");
console.log(`Created: src/content/projects/${project}/notes/${slug}/index.md`);
console.log(
  "Place images in images/; set draft to false when ready to publish."
);
