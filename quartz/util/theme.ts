export interface ColorScheme {
  light: string
  lightgray: string
  gray: string
  darkgray: string
  dark: string
  secondary: string
  tertiary: string
  highlight: string
}

interface Colors {
  lightMode: ColorScheme
  darkMode: ColorScheme
}

export interface Theme {
  typography: {
    header: string
    body: string
    code: string
  }
  cdnCaching: boolean
  colors: Colors
  fontOrigin: "googleFonts" | "local"
}

export type ThemeKey = keyof Colors

const DEFAULT_SANS_SERIF =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
const DEFAULT_MONO = "ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace"

export function googleFontHref(theme: Theme) {
  const { code, header, body } = theme.typography
  const fonts = [code, header, body]
  const families = fonts
    .flatMap((font) => font.split(","))
    .map((font) => font.trim().replace(/^['"]|['"]$/g, "")) // Remove quotes
    .map((font) => font.replace(/ /g, "+")) // Replace spaces with +

  // Note: This simple mapping might need refinement for weight-specific loading 
  // if you want different weights for different fonts in the same list.
  // For now, it joins them into a valid Google Fonts URL query.
  const query = families
    .map((f) => `family=${f}:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900`)
    .join("&")

  return `https://fonts.googleapis.com/css2?${query}&display=swap`
}

export function joinStyles(theme: Theme, ...stylesheet: string[]) {
  return `
${stylesheet.join("\n\n")}

:root {
  --light: ${theme.colors.lightMode.light};
  --lightgray: ${theme.colors.lightMode.lightgray};
  --gray: ${theme.colors.lightMode.gray};
  --darkgray: ${theme.colors.lightMode.darkgray};
  --dark: ${theme.colors.lightMode.dark};
  --secondary: ${theme.colors.lightMode.secondary};
  --tertiary: ${theme.colors.lightMode.tertiary};
  --highlight: ${theme.colors.lightMode.highlight};

  --headerFont: ${theme.typography.header.includes(",") ? theme.typography.header : `"${theme.typography.header}"`}, ${DEFAULT_SANS_SERIF};
  --bodyFont: ${theme.typography.body.includes(",") ? theme.typography.body : `"${theme.typography.body}"`}, ${DEFAULT_SANS_SERIF};
  --codeFont: ${theme.typography.code.includes(",") ? theme.typography.code : `"${theme.typography.code}"`}, ${DEFAULT_MONO};
}

:root[saved-theme="dark"] {
  --light: ${theme.colors.darkMode.light};
  --lightgray: ${theme.colors.darkMode.lightgray};
  --gray: ${theme.colors.darkMode.gray};
  --darkgray: ${theme.colors.darkMode.darkgray};
  --dark: ${theme.colors.darkMode.dark};
  --secondary: ${theme.colors.darkMode.secondary};
  --tertiary: ${theme.colors.darkMode.tertiary};
  --highlight: ${theme.colors.darkMode.highlight};
}
`
}
