/**
 * Language by Repos Card
 * GET /api/languages/repos?username=xxx&hide_border=true
 *
 * Shows languages by repository count (most used languages).
 * Auto-refreshes every 30 minutes.
 */

const { fetchUserLanguagesByRepos } = require("../src/github");
const { getTheme, applyColorOverrides } = require("../src/themes");
const { generateLanguageDonutByReposSVG } = require("../src/svg-language");
const { getCache, setCache, clearCache } = require("../src/cache");

const CACHE_TTL = 30 * 60 * 1000;

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=1800, s-maxage=1800, stale-while-revalidate=600");

  const { username, theme, hide_border, bg_color, title_color, text_color, border_color, refresh } = req.query;

  if (!username) {
    res.status(400).send(errorSVG("Missing username"));
    return;
  }

  try {
    const cacheKey = `langrepos:${username.toLowerCase()}`;

    if (refresh === "true") {
      clearCache(cacheKey);
    }

    let data = getCache(cacheKey);

    if (!data) {
      try {
        data = await fetchUserLanguagesByRepos(username);
        setCache(cacheKey, data, CACHE_TTL);
      } catch (fetchErr) {
        console.error("Lang by repos fetch error:", fetchErr.message);
        res.status(200).send(errorSVG(`Could not fetch data for ${username}`));
        return;
      }
    }

    let colors = getTheme(theme);
    colors = applyColorOverrides(colors, { bg_color, title_color, text_color, border_color });

    const svg = generateLanguageDonutByReposSVG({
      languages: data.languages,
      hideBorder: hide_border === "true",
    });

    res.status(200).send(svg);
  } catch (error) {
    console.error("Lang by repos Error:", error.message);
    res.status(200).send(errorSVG("Failed to load data"));
  }
};

function errorSVG(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="90" viewBox="0 0 460 90">
    <rect width="460" height="90" fill="#0d1117" rx="8"/>
    <text x="230" y="48" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="13" fill="#f85149">${msg}</text>
  </svg>`;
}
