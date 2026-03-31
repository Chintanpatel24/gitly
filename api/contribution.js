/**
 * Contribution Numbers Card
 * GET /api/contribution?username=xxx&hide_border=true&layout=compact
 *
 * Auto-refreshes every 30 minutes.
 */

const { fetchContributionData } = require("../src/github");
const { getTheme, applyColorOverrides } = require("../src/themes");
const {
  generateContributionSVG,
  generateContributionSummarySVG,
  generateContributionPulseSVG,
} = require("../src/svg-contribution");
const { getCache, setCache, clearCache } = require("../src/cache");

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=1800, s-maxage=1800, stale-while-revalidate=600");

  const { username, theme, hide_border, layout, bg_color, title_color, text_color, border_color, title, width, refresh } = req.query;

  if (!username) {
    res.status(400).send(errorSVG("Missing username"));
    return;
  }

  try {
    const cacheKey = `contrib:${username.toLowerCase()}`;

    // Force refresh if requested
    if (refresh === "true") {
      clearCache(cacheKey);
    }

    let contributionData = getCache(cacheKey);

    if (!contributionData) {
      try {
        contributionData = await fetchContributionData(username);
        setCache(cacheKey, contributionData, CACHE_TTL);
      } catch (fetchErr) {
        console.error("Contribution fetch error:", fetchErr.message);
        res.status(200).send(errorSVG(`Could not fetch data for ${username}`));
        return;
      }
    }

    const { totalContributions, days } = contributionData;

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const sortedDays = [...days].sort((a, b) => a.date.localeCompare(b.date));
    for (let i = sortedDays.length - 1; i >= 0; i--) {
      if (sortedDays[i].count > 0) currentStreak++;
      else break;
    }
    for (const day of sortedDays) {
      if (day.count > 0) { tempStreak++; longestStreak = Math.max(longestStreak, tempStreak); }
      else tempStreak = 0;
    }

    let colors = getTheme(theme);
    colors = applyColorOverrides(colors, { bg_color, title_color, text_color, border_color });

    const svg = layout === "compact"
      ? generateContributionSummarySVG({
          username, totalContributions, currentStreak, longestStreak, colors,
          hideBorder: hide_border === "true",
        })
      : layout === "pulse"
        ? generateContributionPulseSVG({
            username, days, totalContributions, colors,
            hideBorder: hide_border === "true", title,
          })
        : generateContributionSVG({
            username, days, totalContributions, colors,
            hideBorder: hide_border === "true", title,
          });

    res.status(200).send(svg);
  } catch (error) {
    console.error("Contribution Error:", error.message);
    res.status(200).send(errorSVG("Failed to load contribution data"));
  }
};

function errorSVG(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="90" viewBox="0 0 380 90">
    <rect width="380" height="90" fill="#0d1117" rx="8"/>
    <text x="190" y="48" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="13" fill="#f85149">${msg}</text>
  </svg>`;
}
