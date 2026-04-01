/**
 * Profile Card
 * GET /api/profile?username=xxx&hide_border=true
 *
 * Shows user profile info: avatar, name, bio, stats.
 * Auto-refreshes every 2 hours.
 */

const { fetchUserProfile } = require("../src/github");
const { getTheme, applyColorOverrides } = require("../src/themes");
const { generateProfileSVG } = require("../src/svg-profile");
const { parseCardWidth } = require("../src/width");
const { getCache, setCache, clearCache } = require("../src/cache");

const CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=7200, s-maxage=7200, stale-while-revalidate=3600");

  const { username, theme, hide_border, bg_color, title_color, text_color, border_color, width, refresh } = req.query;

  if (!username) {
    res.status(400).send(errorSVG("Missing username"));
    return;
  }

  try {
    const cacheKey = `profile:${username.toLowerCase()}`;

    if (refresh === "true") {
      clearCache(cacheKey);
    }

    let data = getCache(cacheKey);

    if (!data) {
      try {
        const profile = await fetchUserProfile(username);
        data = {
          username: profile.login || username,
          name: profile.name || profile.login || username,
          bio: profile.bio || "",
          avatarUrl: profile.avatar_url || "",
          createdAt: profile.created_at,
          publicRepos: profile.public_repos || 0,
          followers: profile.followers || 0,
          following: profile.following || 0,
        };
        setCache(cacheKey, data, CACHE_TTL);
      } catch (fetchErr) {
        console.error("Profile fetch error:", fetchErr.message);
        res.status(200).send(errorSVG(`Could not fetch profile for ${username}`));
        return;
      }
    }

    let colors = getTheme(theme);
    colors = applyColorOverrides(colors, { bg_color, title_color, text_color, border_color });

    const svg = generateProfileSVG({
      username: data.username,
      name: data.name,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      createdAt: data.createdAt,
      publicRepos: data.publicRepos,
      followers: data.followers,
      following: data.following,
      colors,
      hideBorder: hide_border === "true",
      cardWidth: parseCardWidth(width, 460, 420, 1200),
    });

    res.status(200).send(svg);
  } catch (error) {
    console.error("Profile Error:", error.message);
    res.status(200).send(errorSVG("Failed to load profile data"));
  }
};

function errorSVG(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="90" viewBox="0 0 460 90">
    <rect width="460" height="90" fill="#0d1117" rx="8"/>
    <text x="230" y="48" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="13" fill="#f85149">${msg}</text>
  </svg>`;
}
