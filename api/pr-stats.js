/**
 * PR Stats Card
 * GET /api/pr-stats?username=xxx&hide_border=true&layout=compact
 *
 * Auto-refreshes every 30 minutes.
 */

const { fetchUserPullRequests, fetchOpenPullRequests, groupPRsByRepo, fetchUserProfile } = require("../src/github");
const { getTheme, applyColorOverrides } = require("../src/themes");
const { generatePRCardSVG, generatePRSummarySVG } = require("../src/svg-pr");
const { parseCardWidth } = require("../src/width");
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
    const cacheKey = `pr:${username.toLowerCase()}`;

    // Force refresh if requested
    if (refresh === "true") {
      clearCache(cacheKey);
    }

    let data = getCache(cacheKey);

    if (!data) {
      try {
        const [prs, profile, openPRCount] = await Promise.all([
          fetchUserPullRequests(username),
          fetchUserProfile(username).catch(() => ({ name: username, login: username })),
          fetchOpenPullRequests(username),
        ]);

        const repoMap = groupPRsByRepo(prs);

        data = {
          repoMap,
          totalPRs: prs.length,
          openPRs: openPRCount,
          repoCount: Object.keys(repoMap).length,
          profileName: profile.name || profile.login || username,
        };

        setCache(cacheKey, data, CACHE_TTL);
      } catch (fetchErr) {
        console.error("PR fetch error:", fetchErr.message);
        // Return error card
        res.status(200).send(errorSVG(`Could not fetch PRs for ${username}`));
        return;
      }
    }

    let colors = getTheme(theme);
    colors = applyColorOverrides(colors, { bg_color, title_color, text_color, border_color });

    const svg = layout === "compact"
      ? generatePRSummarySVG({
          username: data.profileName,
          totalPRs: data.totalPRs,
          openPRs: data.openPRs,
          repoCount: data.repoCount,
          colors,
          hideBorder: hide_border === "true",
          cardWidth: parseCardWidth(width, 460, 400, 1200),
        })
      : generatePRCardSVG({
          username: data.profileName,
          repoMap: data.repoMap,
          totalPRs: data.totalPRs,
          openPRs: data.openPRs,
          colors,
          hideBorder: hide_border === "true",
          cardWidth: parseCardWidth(width, 460, 400, 1200),
        });

    res.status(200).send(svg);
  } catch (error) {
    console.error("PR Stats Error:", error.message);
    res.status(200).send(errorSVG("Failed to load PR data"));
  }
};

function errorSVG(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="90" viewBox="0 0 380 90">
    <rect width="380" height="90" fill="#0d1117" rx="8"/>
    <text x="190" y="48" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="13" fill="#f85149">${msg}</text>
  </svg>`;
}
