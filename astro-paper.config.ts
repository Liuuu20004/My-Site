import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "http://localhost:4321/",
    title: "Projects & Notes",
    description:
      "Design, implementation, experiments, and notes organized by project.",
    author: "liuuu",
    ogImage: "default-og.svg",
    lang: "en",
    timezone: "Asia/Tokyo",
    dir: "ltr",
  },
  posts: { perPage: 8, perIndex: 4 },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: false,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
  },
  socials: [],
  shareLinks: [],
});
