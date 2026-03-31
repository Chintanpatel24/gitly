/**
 * Visitors Counter Card
 * GET /api/visitors?username=xxx
 *
 * Displays visitor count for a GitHub profile
 */

const { getTheme, applyColorOverrides } = require("../src/themes");
const { generateVisitorsSVG } = require("../src/svg-visitors");
const { getCache, setCache } = require("../src/cache");

// In-memory visitor counter (can be replaced with database)
const visitorCounts = {};

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

  const { username, theme, hide_border, bg_color, title_color, text_color, border_color, width } = req.query;

  if (!username) {
    res.status(400).send(errorSVG("Missing username"));
    return;
  }

  try {
    const userKey = username.toLowerCase();
    
    // Increment visitor count
    if (!visitorCounts[userKey]) {
      visitorCounts[userKey] = 0;
    }
    visitorCounts[userKey]++;

    // Try to get from cache, update it
    let cachedData = getCache(`visitors:${userKey}`);
    if (!cachedData) {
      cachedData = { count: 0 };
    }
    cachedData.count = visitorCounts[userKey];
    setCache(`visitors:${userKey}`, cachedData, 24 * 60 * 60 * 1000); // 24 hours

    let colors = getTheme(theme);
    colors = applyColorOverrides(colors, { bg_color, title_color, text_color, border_color });

    const svg = generateVisitorsSVG({
      username,
      count: visitorCounts[userKey],
      colors,
      hideBorder: hide_border === "true",
      cardWidth: parseInt(width) || 460,
    });

    res.status(200).send(svg);
  } catch (error) {
    console.error("Visitors Card Error:", error.message);
    res.status(200).send(errorSVG("Failed to load visitors card"));
  }
};

function errorSVG(msg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="120" viewBox="0 0 460 120">
    <rect width="460" height="120" fill="#0d1117" rx="8"/>
    <text x="230" y="65" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="12" fill="#f85149">${msg}</text>
  </svg>`;
}
