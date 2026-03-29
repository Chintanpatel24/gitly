const { generateContribCard } = require("../lib/contrib-card");
const { fetchContributions }  = require("../lib/github");

module.exports = async (req, res) => {
  const username = (req.query.username || "").trim();

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (!username) {
    return res.end(errSVG("Missing ?username= in URL"));
  }

  try {
    const data = await fetchContributions(username);
    res.end(generateContribCard({ username, contributions: data }));
  } catch (e) {
    res.end(errSVG("Could not load data for: " + username));
  }
};

function errSVG(msg) {
  return `<svg width="800" height="60" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="60" rx="8" fill="#0d1117" stroke="#f85149" stroke-width="1"/>
    <text x="16" y="36" font-family="system-ui" font-size="13" fill="#f85149">${msg}</text>
  </svg>`;
}
