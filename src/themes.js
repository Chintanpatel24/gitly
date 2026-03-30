/**
 * Theme definitions for card styling.
 * Each theme defines colors for backgrounds, titles, text, borders, and accents.
 */

const themes = {
  default: {
    bg_color: "ffffff",
    title_color: "2f80ed",
    text_color: "434d58",
    border_color: "e4e2e2",
    accent_color: "2f80ed",
  },
  dark: {
    bg_color: "0d1117",
    title_color: "58a6ff",
    text_color: "c9d1d9",
    border_color: "30363d",
    accent_color: "58a6ff",
  },
  synthwave: {
    bg_color: "2b213a",
    title_color: "ff7edb",
    text_color: "f8f8f2",
    border_color: "494059",
    accent_color: "ff7edb",
  },
  radical: {
    bg_color: "141321",
    title_color: "fe428e",
    text_color: "a9fef7",
    border_color: "3b3b4f",
    accent_color: "fe428e",
  },
  tokyonight: {
    bg_color: "1a1b27",
    title_color: "70a5fd",
    text_color: "38bdae",
    border_color: "565f89",
    accent_color: "70a5fd",
  },
  dracula: {
    bg_color: "282a36",
    title_color: "ff79c6",
    text_color: "f8f8f2",
    border_color: "6272a4",
    accent_color: "bd93f9",
  },
  gruvbox: {
    bg_color: "282828",
    title_color: "fabd2f",
    text_color: "ebdbb2",
    border_color: "504945",
    accent_color: "83a598",
  },
  monokai: {
    bg_color: "272822",
    title_color: "f92672",
    text_color: "f8f8f2",
    border_color: "49483e",
    accent_color: "a6e22e",
  },
  nord: {
    bg_color: "2e3440",
    title_color: "88c0d0",
    text_color: "d8dee9",
    border_color: "4c566a",
    accent_color: "81a1c1",
  },
  solarized_dark: {
    bg_color: "002b36",
    title_color: "268bd2",
    text_color: "839496",
    border_color: "073642",
    accent_color: "2aa198",
  },
  solarized_light: {
    bg_color: "fdf6e3",
    title_color: "268bd2",
    text_color: "657b83",
    border_color: "eee8d5",
    accent_color: "2aa198",
  },
  catppuccin: {
    bg_color: "1e1e2e",
    title_color: "cba6f7",
    text_color: "cdd6f4",
    border_color: "45475a",
    accent_color: "89b4fa",
  },
  github_dark: {
    bg_color: "0d1117",
    title_color: "58a6ff",
    text_color: "8b949e",
    border_color: "21262d",
    accent_color: "238636",
  },
  highcontrast: {
    bg_color: "000000",
    title_color: "e5c07b",
    text_color: "ffffff",
    border_color: "ffffff",
    accent_color: "61afef",
  },
};

/**
 * Get a theme by name, falling back to default.
 * @param {string} themeName
 * @returns {Object}
 */
function getTheme(themeName) {
  return themes[themeName] || themes.default;
}

/**
 * Override specific theme colors with custom hex values.
 * @param {Object} theme
 * @param {Object} overrides - { bg_color, title_color, text_color, border_color }
 * @returns {Object}
 */
function applyColorOverrides(theme, overrides) {
  const result = { ...theme };
  const colorKeys = ["bg_color", "title_color", "text_color", "border_color", "accent_color"];
  for (const key of colorKeys) {
    if (overrides[key]) {
      result[key] = overrides[key].replace("#", "");
    }
  }
  return result;
}

module.exports = { themes, getTheme, applyColorOverrides };
