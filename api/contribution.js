/**
 * Vercel serverless function: Contribution Numbers Card
 * GET /api/contribution?username=xxx&theme=dark&hide_border=true&layout=grid
 *
 * GitHub data is cached for 40 minutes to avoid rate limiting.
 */

const {
  fetchContributionData,
  fetchContributionDataFallback,
} = require("../src/github");
const { getTheme, applyColorOverrides } = require("../src/themes");
const {
  generateContributionSVG,
  generateContributionSummarySVG,
} = require("../src/svg-contribution");
const { getCache, setCache } = require("../src/cache");

const CACHE_TTL = 40 * 60 * 1000; // 40 minutes in milliseconds

module.exports = async (req, res) => {
  // Set CORS and content headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Content-Type", "image/svg+xml");
  // CDN caches for 40 minutes (2400s), allows stale for 10 min while revalidating
  res.setHeader("Cache-Control", "public, max-age=2400, s-maxage=2400, stale-while-revalidate=600");

  const {
    username,
    theme,
    hide_border,
    layout,
    bg_color,
    title_color,
    text_color,
    border_color,
    title,
    width,
  } = req.query;

  if (!username) {
    res.status(400).send(generateErrorSVG("Missing 'username' parameter"));
    return;
  }

  try {
    // Check cache for GitHub data
    const cacheKey = `contrib:${username}`;
    let contributionData = getCache(cacheKey);

    if (!contributionData) {
      // Cache miss - fetch from GitHub API
      try {
        contributionData = await fetchContributionData(username);
      } catch {
        contributionData = await fetchContributionDataFallback(username);
      }

      // Store in cache for 40 minutes
      setCache(cacheKey, contributionData, CACHE_TTL);
    }

    const { totalContributions, days } = contributionData;

    // Calculate streaks
    const sortedDays = [...days].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = sortedDays.length - 1; i >= 0; i--) {
      if (sortedDays[i].count > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    for (const day of sortedDays) {
      if (day.count > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Build theme colors (not cached - uses request params)
    let colors = getTheme(theme);
    colors = applyColorOverrides(colors, {
      bg_color,
      title_color,
      text_color,
      border_color,
    });

    const options = {
      username,
      days,
      totalContributions,
      currentStreak,
      longestStreak,
      colors,
      hideBorder: hide_border === "true",
      title,
      cardWidth: parseInt(width) || null,
    };

    let svg;
    if (layout === "compact") {
      svg = generateContributionSummarySVG(options);
    } else {
      svg = generateContributionSVG(options);
    }

    res.status(200).send(svg);
  } catch (error) {
    console.error("Contribution Error:", error.message);
    res.status(500).send(generateErrorSVG("Failed to fetch contribution data"));
  }
};

function generateErrorSVG(message) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="100" viewBox="0 0 380 100">
    <rect x="0.5" y="0.5" width="379" height="99" fill="#0d1117" rx="4.5" stroke="#30363d" stroke-width="1"/>
    <text x="190" y="55" text-anchor="middle" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="14" fill="#f85149">${message}</text>
  </svg>`;
}
