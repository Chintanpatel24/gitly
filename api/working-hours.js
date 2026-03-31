/**
 * Working Hours Card
 * GET /api/working-hours?username=xxx
 *
 * Calculates actual working time by analyzing commit timestamp gaps.
 * Formula: TWt = Σ (Ti+1 - Ti) for all i where (Ti+1 - Ti) < 5 hours
 * Refreshes every 2 hours.
 */

const { fetchUserCommitTimestamps } = require("../src/github");
const { getTheme, applyColorOverrides } = require("../src/themes");
const { generateWorkingHoursSVG } = require("../src/svg-working-hours");
const { getCache, setCache, clearCache } = require("../src/cache");

const CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=1800");

  const { username, theme, hide_border, bg_color, title_color, text_color, border_color, refresh } = req.query;

  if (!username) {
    res.status(400).send(errorSVG("Missing username"));
    return;
  }

  try {
    const cacheKey = `workinghours:${username.toLowerCase()}`;

    // Force refresh if requested
    if (refresh === "true") {
      clearCache(cacheKey);
    }

    let cachedData = getCache(cacheKey);

    if (!cachedData) {
      try {
        // Fetch commit timestamps to calculate actual working time
        const commitData = await fetchUserCommitTimestamps(username);

        cachedData = {
          totalHours: commitData.totalWorkingHours,
          commitCount: commitData.commitCount,
          lastUpdated: new Date(),
        };

        setCache(cacheKey, cachedData, CACHE_TTL);
      } catch (fetchErr) {
        console.error("Working Hours fetch error:", fetchErr.message);
        res.status(200).send(errorSVG(`Could not fetch data for ${username}`));
        return;
      }
    }

    let colors = getTheme(theme);
    colors = applyColorOverrides(colors, { bg_color, title_color, text_color, border_color });

    const svg = generateWorkingHoursSVG({
      username,
      totalHours: cachedData.totalHours,
      commitCount: cachedData.commitCount,
      colors,
      hideBorder: hide_border === "true",
    });

    res.status(200).send(svg);
  } catch (error) {
    console.error("Working Hours Error:", error.message);
    res.status(200).send(errorSVG("Failed to load working hours data"));
  }
};

function errorSVG(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="120" viewBox="0 0 380 120">
    <rect width="380" height="120" fill="#0d1117" rx="8"/>
    <text x="190" y="65" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="13" fill="#f85149">${msg}</text>
  </svg>`;
}
