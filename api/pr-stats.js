/**
 * Vercel serverless function: PR Stats Card
 * GET /api/pr-stats?username=xxx&theme=dark&hide_border=true&layout=compact
 *
 * GitHub data is cached for 40 minutes to avoid rate limiting.
 */

const {
  fetchUserPullRequests,
  groupPRsByRepo,
  fetchUserProfile,
} = require("../src/github");
const { getTheme, applyColorOverrides } = require("../src/themes");
const { generatePRCardSVG, generatePRSummarySVG } = require("../src/svg-pr");
const { getCache, setCache } = require("../src/cache");

const CACHE_TTL = 40 * 60 * 1000; // 40 minutes in milliseconds

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Content-Type", "image/svg+xml");
  // CDN caches for 40 minutes (2400s), allows stale for 10 min while revalidating
  res.setHeader("Cache-Control", "public, max-age=2400, s-maxage=2400, stale-while-revalidate=600");

  const { username, theme, hide_border, layout, bg_color, title_color, text_color, border_color, title, width } = req.query;

  if (!username) {
    res.status(400).send(generateErrorSVG("Missing 'username' parameter"));
    return;
  }

  try {
    // Check cache for GitHub data
    const cacheKey = `pr:${username}`;
    let data = getCache(cacheKey);

    if (!data) {
      // Cache miss - fetch from GitHub API
      const [prs, profile] = await Promise.all([
        fetchUserPullRequests(username),
        fetchUserProfile(username).catch(() => ({ name: username })),
      ]);

      data = {
        repoMap: groupPRsByRepo(prs),
        totalPRs: prs.length,
        repoCount: Object.keys(groupPRsByRepo(prs)).length,
        profileName: profile.name || username,
      };

      // Store in cache for 40 minutes
      setCache(cacheKey, data, CACHE_TTL);
    }

    // Build theme/colors (not cached - uses request params)
    let colors = getTheme(theme);
    colors = applyColorOverrides(colors, {
      bg_color,
      title_color,
      text_color,
      border_color,
    });

    const options = {
      username: data.profileName,
      repoMap: data.repoMap,
      totalPRs: data.totalPRs,
      repoCount: data.repoCount,
      colors,
      hideBorder: hide_border === "true",
      title,
      cardWidth: parseInt(width) || 420,
    };

    let svg;
    if (layout === "compact") {
      svg = generatePRSummarySVG(options);
    } else {
      svg = generatePRCardSVG(options);
    }

    res.status(200).send(svg);
  } catch (error) {
    console.error("PR Stats Error:", error.message);
    res.status(500).send(generateErrorSVG("Failed to fetch PR data"));
  }
};

function generateErrorSVG(message) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="100" viewBox="0 0 380 100">
    <rect x="0.5" y="0.5" width="379" height="99" fill="#0d1117" rx="4.5" stroke="#30363d" stroke-width="1"/>
    <text x="190" y="55" text-anchor="middle" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="14" fill="#f85149">${message}</text>
  </svg>`;
}
