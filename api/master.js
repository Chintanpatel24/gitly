/**
 * Master Card - Combines all stats into one card
 * GET /api/master?username=xxx&hide_border=true
 *
 * Displays: PR stats, languages, contributions, and repositories
 */

const { fetchUserPullRequests, fetchOpenPullRequests, groupPRsByRepo, fetchUserLanguages, fetchContributionData, fetchUserProfile } = require("../src/github");
const { getTheme, applyColorOverrides } = require("../src/themes");
const { generateMasterCardSVG } = require("../src/svg-master");
const { getCache, setCache, clearCache } = require("../src/cache");

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// In-memory visitor counter
const visitorCounts = {};

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=1800, s-maxage=1800, stale-while-revalidate=600");

  const { username, theme, hide_border, bg_color, title_color, text_color, border_color, width, refresh } = req.query;

  if (!username) {
    res.status(400).send(errorSVG("Missing username"));
    return;
  }

  try {
    const cacheKey = `master:${username.toLowerCase()}`;

    // Force refresh if requested
    if (refresh === "true") {
      clearCache(cacheKey);
    }

    let data = getCache(cacheKey);

    if (!data) {
      try {
        const [prs, openPRCount, languages, contributionData, profile] = await Promise.all([
          fetchUserPullRequests(username),
          fetchOpenPullRequests(username),
          fetchUserLanguages(username),
          fetchContributionData(username),
          fetchUserProfile(username).catch(() => ({ public_repos: 0, name: username })),
        ]);

        const repoMap = groupPRsByRepo(prs);
        const repoList = Object.entries(repoMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        const languageArray = Object.entries(languages || {})
          .map(([name, percentage]) => ({ name, percentage }))
          .sort((a, b) => b.percentage - a.percentage);

        const totalContributions = contributionData.totalContributions || 0;
        const contributionDays = Array.isArray(contributionData.days) ? contributionData.days : [];

        data = {
          totalPRs: prs.length,
          openPRs: openPRCount,
          repoCount: profile.public_repos || 0,
          repoList,
          languages: languageArray,
          contributions: totalContributions,
          contributionDays,
          username,
        };

        setCache(cacheKey, data, CACHE_TTL);
      } catch (fetchErr) {
        console.error("Master card fetch error:", fetchErr.message);
        res.status(200).send(errorSVG(`Could not fetch data for ${username}`));
        return;
      }
    }

    let colors = getTheme(theme);
    colors = applyColorOverrides(colors, { bg_color, title_color, text_color, border_color });

    // Get and increment visitor count
    const userKey = username.toLowerCase();
    if (!visitorCounts[userKey]) {
      visitorCounts[userKey] = 0;
    }
    visitorCounts[userKey]++;

    const svg = generateMasterCardSVG({
      username: data.username,
      totalPRs: data.totalPRs,
      openPRs: data.openPRs,
      repoCount: data.repoCount,
      repoList: data.repoList,
      languages: data.languages,
      contributions: data.contributions,
      contributionDays: data.contributionDays,
      visitors: visitorCounts[userKey],
      colors,
      hideBorder: hide_border === "true",
      cardWidth: parseInt(width) || 1000,
    });

    res.status(200).send(svg);
  } catch (error) {
    console.error("Master Card Error:", error.message);
    res.status(200).send(errorSVG("Failed to load master card"));
  }
};

function errorSVG(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="200" viewBox="0 0 1000 200">
    <rect width="1000" height="200" fill="#0d1117" rx="8"/>
    <text x="500" y="110" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="14" fill="#f85149">${msg}</text>
  </svg>`;
}
