/**
 * Commits Ranking Card
 * GET /api/commits?username=xxx&hide_border=true&layout=compact
 *
 * Shows contribution days ranked from highest to lowest commit count.
 * Auto-refreshes every 30 minutes.
 */

const { fetchContributionData } = require("../src/github");
const { getTheme, applyColorOverrides } = require("../src/themes");
const {
  generateCommitsRankingSVG,
  generateCommitsCompactSVG,
} = require("../src/svg-commits");
const { getCache, setCache, clearCache } = require("../src/cache");

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=1800, s-maxage=1800, stale-while-revalidate=600");

  const { username, theme, hide_border, layout, bg_color, title_color, text_color, border_color, title, refresh } = req.query;

  if (!username) {
    res.status(400).send(errorSVG("Missing username"));
    return;
  }

  try {
    const cacheKey = `commits:${username.toLowerCase()}`;

    if (refresh === "true") {
      clearCache(cacheKey);
    }

    let contributionData = getCache(cacheKey);

    if (!contributionData) {
      try {
        contributionData = await fetchContributionData(username);
        setCache(cacheKey, contributionData, CACHE_TTL);
      } catch (fetchErr) {
        console.error("Commits fetch error:", fetchErr.message);
        res.status(200).send(errorSVG(`Could not fetch data for ${username}`));
        return;
      }
    }

    const { totalContributions, days } = contributionData;

    let colors = getTheme(theme);
    colors = applyColorOverrides(colors, { bg_color, title_color, text_color, border_color });

    const svg = layout === "compact"
      ? generateCommitsCompactSVG({
          username, days, totalContributions, colors,
          hideBorder: hide_border === "true",
        })
      : generateCommitsRankingSVG({
          username, days, totalContributions, colors,
          hideBorder: hide_border === "true", title,
        });

    res.status(200).send(svg);
  } catch (error) {
    console.error("Commits Error:", error.message);
    res.status(200).send(errorSVG("Failed to load commits data"));
  }
};

function errorSVG(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="90" viewBox="0 0 460 90">
    <rect width="460" height="90" fill="#0d1117" rx="8"/>
    <text x="230" y="48" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="13" fill="#f85149">${msg}</text>
  </svg>`;
}
