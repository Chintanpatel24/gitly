/**
 * Profile Card SVG generation
 * Shows user info, join date, and key stats.
 */

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function generateProfileSVG(options) {
  const {
    username,
    name,
    bio,
    createdAt,
    publicRepos = 0,
    followers = 0,
    following = 0,
    colors,
    hideBorder,
  } = options;

  const W = 460, H = 200, P = 24;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;

  const accentColor = (colors && colors.accent_color) || "58a6ff";
  const titleColor = (colors && colors.title_color) || "e6edf3";
  const textColor = (colors && colors.text_color) || "c9d1d9";

  const displayName = name || username;
  const bioText = bio ? (bio.length > 55 ? bio.substring(0, 52) + "..." : bio) : "";

  const joinDate = createdAt ? new Date(createdAt) : null;
  const joinStr = joinDate ? joinDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Unknown";
  const now = new Date();
  const yearsActive = joinDate ? ((now - joinDate) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1) : "0";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="profGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#${accentColor};stop-opacity:0.1"/>
      <stop offset="100%" style="stop-color:#${accentColor};stop-opacity:0"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#0d1117" ${hba}/>
  <rect width="${W}" height="3" fill="#${accentColor}" rx="8"/>
  <rect x="0" y="3" width="${W}" height="80" fill="url(#profGrad)"/>

  <circle cx="52" cy="60" r="32" fill="#${accentColor}" opacity=".12"/>
  <circle cx="52" cy="60" r="30" fill="#161b22"/>
  <text x="52" y="70" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="26" font-weight="700" fill="#${accentColor}">${escapeXml(username.charAt(0).toUpperCase())}</text>

  <text x="100" y="46" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="16" font-weight="700" fill="#${titleColor}">${escapeXml(displayName)}</text>
  <text x="100" y="62" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#8b949e">@${escapeXml(username)}</text>
  ${bioText ? `<text x="100" y="78" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#${textColor}">${escapeXml(bioText)}</text>` : ""}

  <line x1="${P}" y1="96" x2="${W - P}" y2="96" stroke="#30363d" stroke-width=".5"/>

  <g transform="translate(${P},104)">
    <rect width="128" height="50" rx="8" fill="#1f6feb" opacity=".06"/>
    <text x="64" y="26" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="20" font-weight="700" fill="#1f6feb">${publicRepos}</text>
    <text x="64" y="42" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">Repositories</text>
  </g>
  <g transform="translate(${P + 140},104)">
    <rect width="128" height="50" rx="8" fill="#${accentColor}" opacity=".06"/>
    <text x="64" y="26" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="20" font-weight="700" fill="#${accentColor}">${followers}</text>
    <text x="64" y="42" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">Followers</text>
  </g>
  <g transform="translate(${P + 280},104)">
    <rect width="128" height="50" rx="8" fill="#8b5cf6" opacity=".06"/>
    <text x="64" y="26" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="20" font-weight="700" fill="#8b5cf6">${following}</text>
    <text x="64" y="42" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">Following</text>
  </g>

  <line x1="${P}" y1="${H - 26}" x2="${W - P}" y2="${H - 26}" stroke="#30363d" stroke-width=".5"/>
  <text x="${P}" y="${H - 10}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">Joined ${joinStr}</text>
  <text x="${W - P}" y="${H - 10}" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">${yearsActive} years on GitHub</text>
</svg>`;
}

module.exports = { generateProfileSVG };
