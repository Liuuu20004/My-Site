# Projects & Notes

A personal website based on [AstroPaper](https://github.com/satnaing/astro-paper), with Markdown notes organized by project.

## Start the website

From the `site` directory:

```sh
./scripts/dev.sh
```

Open `http://localhost:4321/My-Site/` (use the port printed by Astro if 4321 is busy). The launcher uses your installed Node.js, or the bundled Codex Node.js runtime when available. Dependencies have already been installed in this workspace.

The development server runs in the background. To check its status or stop it:

```sh
./scripts/dev.sh status
./scripts/dev.sh stop
```

On another computer, install Node.js 24 (minimum 22.12) and pnpm 11 first:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm build         # Type-check, build static pages, and generate the search index
pnpm preview       # Preview the production build with search
pnpm lint
pnpm format:check
```

The search index is generated during the build. Run `pnpm build` after updating notes if you want development search to include those changes.

## Content structure

```text
src/content/
├── note-metadata.json                       # Website metadata for unchanged imported notes
├── projects/
│   ├── dtt/
│   │   ├── index.md                         # Project overview
│   │   ├── notes/
│   │   │   ├── hw1/
│   │   │   │   ├── all_reduce.md
│   │   │   │   ├── array_init_in_python.md
│   │   │   │   ├── data_parallel_and_tensor_parallel.md
│   │   │   │   └── memory_and_communication.md
│   │   │   └── hw2/
│   │   │       └── matrix_calculation_in_cnn.md
│   │   └── images/hw1/                      # The 9 images referenced by HW1 notes
│   └── ticketer/
│       ├── index.md                         # Project overview
│       └── notes/why_apis.md                # Unchanged imported note
└── pages/about.md
```

Project pages, their note lists, the homepage, tags, RSS, and search are generated automatically. The original starter notes have been removed.

## Imported DTT notes

The imported Markdown files and image files are exact copies of the originals in `distributed_tiny_torch/docs`. Their text, whitespace, filenames, and relative image references have not been changed. The original source files remain untouched.

The structure mirrors the source so image references such as `../../images/hw1/centralized_all_reduce.png` still resolve. `hw1.md` and `hw2/eliminating_naive_python_loops.md` are intentionally excluded. The imported CNN note currently references no images.

Titles, descriptions, publication dates, and tags are kept separately in `src/content/note-metadata.json`. Titles and descriptions use each original first heading; HW1 dates use source file modification times and the CNN note uses its existing September 28, 2026 date. No frontmatter has been added to the imported files.

Imported Markdown is excluded from automatic formatting to protect the originals. Math is rendered using remark-math and KaTeX; no formulas are rewritten.

## Imported Ticketer notes

`projects/ticketer/notes/why_apis.md` is an exact copy of `ticketer/docs/notes/why_apis.md`, with no changes to text, whitespace, or code examples. It references no images. Website metadata is stored separately in `note-metadata.json`; the publication date uses the original `20261008` date. The note is excluded from automatic formatting.

## Write a new note

```sh
pnpm new:note dtt autograd "Implementing Autograd"
pnpm new:note ticketer database-design "Database Design"
```

This creates `notes/<note-slug>/index.md` and its sibling `images/` directory. New notes start with `draft: true` and do not appear on public pages, in RSS, or in search until you set it to `false`. The command will not overwrite an existing note.

New notes can use regular AstroPaper frontmatter:

```yaml
---
title: Implementing Autograd
description: Computation graphs, backpropagation, and gradient accumulation.
pubDatetime: 2026-10-03T10:00:00+09:00
tags: [autograd, tensor]
draft: false
---
```

`title`, `description`, and `pubDatetime` are required. Add `modDatetime` when updating an article. Production builds exclude future notes until their publication time.

Keep images with the new note and use relative references:

```markdown
![Computation graph](./images/computation-graph.svg)
```

Both flat `.md` files and folder-based `index.md` notes are supported. Imported flat files obtain metadata from the sidecar JSON; new notes normally carry their own frontmatter.

## Add a project

Create `src/content/projects/<project>/index.md`:

```yaml
---
title: Project Name
description: A short explanation of the project.
order: 3
# repository: https://github.com/your-account/project
# demo: https://your-demo.example
---
```

Write the overview below the frontmatter and put notes under the project's `notes/` directory. Project association is determined by the folder.

## Routes and configuration

| Page                      | URL                                            |
| ------------------------- | ---------------------------------------------- |
| Home                      | `/`                                            |
| Projects                  | `/projects/`                                   |
| DTT                       | `/projects/dtt/`                               |
| All Reduce                | `/projects/dtt/hw1/all_reduce/`                |
| Matrix Calculation in CNN | `/projects/dtt/hw2/matrix_calculation_in_cnn/` |
| Ticketer                  | `/projects/ticketer/`                          |
| All Notes                 | `/notes/`                                      |
| Search                    | `/search/`                                     |
| Tags                      | `/tags/`                                       |
| About                     | `/about/`                                      |
| RSS                       | `/rss.xml`                                     |

The routes above are relative to the configured `/My-Site` base. For example, DTT is available at `/My-Site/projects/dtt/` locally and in production.

Set the site title, author, and domain in `astro-paper.config.ts`. `site.url` is `https://liuuu20004.github.io`, and `base` in `astro.config.ts` is `/My-Site`. Update both if the repository name or hosting location changes. Project repository links are configured in their overview files.

The site uses Times New Roman with serif fallbacks for text, monospace fonts for code, and local KaTeX fonts for formulas. `public/default-og.svg` is the initial sharing image; use PNG/JPEG for wider social platform compatibility when publishing.

The Git repository is rooted at `site/.git`. Dependencies, build output, generated search files, and local environment files are ignored.

## Publish to GitHub Pages

The public site is [liuuu20004.github.io/My-Site](https://liuuu20004.github.io/My-Site/), built from [Liuuu20004/My-Site](https://github.com/Liuuu20004/My-Site).

GitHub Pages uses **GitHub Actions** as its source. `.github/workflows/deploy.yml` installs the locked dependencies with Node.js 24 and pnpm 11.19.0, checks lint and formatting, builds the pages and search index, and deploys `dist`. Every push to `main` publishes an update; the workflow can also be run manually from the repository's Actions tab.

After editing notes:

```sh
pnpm lint
pnpm format:check
pnpm build
git add <changed-files>
git commit -m "Add project notes"
git push origin main
```

Keep tokens and local configuration in ignored `.env` files. Only commit `.env.example` with placeholder values. Build output and dependencies are generated by Actions and do not need to be committed.

## Attribution

Built on AstroPaper. Its MIT [license](LICENSE) is retained.
