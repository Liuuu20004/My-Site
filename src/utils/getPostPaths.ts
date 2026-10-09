import { getRelativeLocaleUrl } from "astro:i18n";
import config from "@/config";

/** Notes are stored as <project>/notes/<note>/index.md. */
export function getNoteParts(id: string) {
  const [project, notesDirectory, ...segments] = id.split("/");
  if (notesDirectory !== "notes" || !project || segments.length === 0) {
    throw new Error(`Invalid note path: ${id}`);
  }
  return { project, note: segments.join("/") };
}

export function getProjectUrl(
  project: string,
  locale: string | undefined = config.site.lang
) {
  return getRelativeLocaleUrl(locale, `projects/${project}/`);
}

export function getPostSlug(id: string, _filePath?: string): string {
  const { project, note } = getNoteParts(id);
  return `${project}/${note}`;
}

export function getPostUrl(
  id: string,
  _filePath?: string,
  locale: string | undefined = config.site.lang
): string {
  return getRelativeLocaleUrl(locale, `projects/${getPostSlug(id)}/`);
}
