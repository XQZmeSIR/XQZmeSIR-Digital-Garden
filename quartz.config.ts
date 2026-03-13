import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "🪴 XQZmeSIR",
    enableSPA: true,
    enablePopovers: true,
    analytics: { provider: "goatcounter", websiteId: "xqzmesir" },
    locale: "en-US",
    baseUrl: "xqzmesir.ru",
    ignorePatterns: [
      "private",
      "templates",
      "clippings",
      "copilot",
      "copilot-conversations",
      "copilot-custom-prompts",
      ".obsidian",
    ],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Space Grotesk",
        // header: "Schibsted Grotesk",
        // body: "Source Sans Pro", M PLUS Rounded 1c, Exo 2, Libre Franklin, Vollkorn, JetBrains Mono, Gidole, Rubik
        body: "Space Grotesk", // "PT Sans", "Inconsolata",
        code: "Space Mono",
      },
      colors: {
        lightMode: {
          light: "#ffffff",
          lightgray: "#e5e5e5",
          gray: "#b8b8b8",
          darkgray: "#4e4e4e",
          dark: "#2b2b2b",
          // secondary: "#284b63",
          secondary: "#f05a7f",
          tertiary: "#2b2b2b",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          // Rolled-back black theme variant for reference:
          // light: "#0a0a0a",
          // lightgray: "#232323",
          // gray: "#9a9a9a",
          // darkgray: "#d6d6d6",
          // dark: "#fafafa",
          // secondary: "#fafafa",
          // tertiary: "#d6d6d6",
          // highlight: "rgba(250, 250, 250, 0.08)",
          light: "#1d2433", // Dark background
          lightgray: "#2f3b54", // UI elements
          gray: "#a2aabc", // Text color
          darkgray: "#d7dce2", // Highlighted text
          dark: "#d7dce2", // Light text
          secondary: "#5ccfe6", // Cyan accent
          tertiary: "#c3a6ff", // Purple/lavender accent
          highlight: "rgba(92, 207, 230, 0.15)", // Cyan highlight
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["git", "frontmatter"],
      }),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
    ],
    filters: [Plugin.ExplicitPublish()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
