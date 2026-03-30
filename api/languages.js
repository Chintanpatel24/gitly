/**
 * Language Usage Card
 * GET /api/languages?username=xxx&hide_border=true&layout=compact
 *
 * Auto-refreshes every 30 minutes.
 */

const { fetchUserLanguages } = require("../src/github");
const { getTheme, applyColorOverrides } = require("../src/themes");
const {
  generateLanguageSVG,
  generateLanguageCompactSVG,
  generateLanguageDonutSVG,
} = require("../src/svg-language");
const { getCache, setCache, clearCache } = require("../src/cache");

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=1800, s-maxage=1800, stale-while-revalidate=600");

  const { username, theme, hide_border, layout, max_langs, bg_color, title_color, text_color, border_color, refresh } = req.query;

  if (!username) {
    res.status(400).send(errorSVG("Missing username"));
    return;
  }

  try {
    const cacheKey = `langs:${username.toLowerCase()}`;

    // Force refresh if requested
    if (refresh === "true") {
      clearCache(cacheKey);
    }

    let langData = getCache(cacheKey);

    if (!langData) {
      try {
        langData = await fetchUserLanguages(username);
        setCache(cacheKey, langData, CACHE_TTL);
      } catch (fetchErr) {
        console.error("Language fetch error:", fetchErr.message);
        res.status(200).send(errorSVG(`Could not fetch languages for ${username}`));
        return;
      }
    }

    let colors = getTheme(theme);
    colors = applyColorOverrides(colors, { bg_color, title_color, text_color, border_color });

    const svg = layout === "compact"
      ? generateLanguageCompactSVG({
          username, languages: langData.languages, colors,
          hideBorder: hide_border === "true",
        })
      : layout === "donut"
        ? generateLanguageDonutSVG({
            username, languages: langData.languages, colors,
            hideBorder: hide_border === "true",
          })
        : generateLanguageSVG({
            username, languages: langData.languages, totalBytes: langData.totalBytes, colors,
            hideBorder: hide_border === "true",
            maxLangs: parseInt(max_langs) || 12,
          });

    res.status(200).send(svg);
  } catch (error) {
    console.error("Language Error:", error.message);
    res.status(200).send(errorSVG("Failed to load language data"));
  }
};

function errorSVG(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="90" viewBox="0 0 380 90">
    <rect width="380" height="90" fill="#0d1117" rx="8"/>
    <text x="190" y="48" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="13" fill="#f85149">${msg}</text>
  </svg>`;
}
