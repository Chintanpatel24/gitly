/**
 * Profile Card SVG generation
 * Shows user avatar, name, bio, join date, and key stats.
 */

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function generateProfileSVG(options) {
  const {
    username,
    name,
    bio,
    avatarUrl,
    createdAt,
    publicRepos = 0,
    followers = 0,
    following = 0,
    colors,
    hideBorder,
  } = options;

  const W = 460, H = 220, P = 24;
  const hba = hideBorder ? `rx="10"` : `rx="10" stroke="#30363d" stroke-width="1"`;

  const accentColor = (colors && colors.accent_color) || "58a6ff";
  const titleColor = (colors && colors.title_color) || "e6edf3";
  const textColor = (colors && colors.text_color) || "c9d1d9";

  const displayName = name || username;
  const bioText = bio ? (bio.length > 60 ? bio.substring(0, 57) + "..." : bio) : "GitHub user";

  const joinDate = createdAt ? new Date(createdAt) : null;
  const joinStr = joinDate ? joinDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Unknown";
  const now = new Date();
  const yearsActive = joinDate ? ((now - joinDate) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1) : "0";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <clipPath id="avatarClip">
      <circle cx="56" cy="76" r="36"/>
    </clipPath>
    <linearGradient id="profGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#${accentColor};stop-opacity:0.12"/>
      <stop offset="100%" style="stop-color:#${accentColor};stop-opacity:0"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#0d1117" ${hba}/>
  <rect width="${W}" height="4" fill="#${accentColor}" rx="10"/>
  <rect x="0" y="4" width="${W}" height="90" fill="url(#profGrad)"/>

  <!-- Avatar placeholder (circle with initial) -->
  <circle cx="56" cy="76" r="38" fill="#${accentColor}" opacity=".15"/>
  <circle cx="56" cy="76" r="36" fill="#161b22"/>
  <text x="56" y="86" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="28" font-weight="700" fill="#${accentColor}">${escapeXml(username.charAt(0).toUpperCase())}</text>

  <!-- Name and bio -->
  <text x="110" y="58" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="18" font-weight="700" fill="#${titleColor}">${escapeXml(displayName)}</text>
  <text x="110" y="76" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" fill="#8b949e">@${escapeXml(username)}</text>
  <text x="110" y="96" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#${textColor}">${escapeXml(bioText)}</text>

  <!-- Stats row -->
  <g transform="translate(${P},120)">
    <rect width="128" height="48" rx="10" fill="#1f6feb" opacity=".06"/>
    <text x="64" y="26" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="20" font-weight="700" fill="#1f6feb">${publicRepos}</text>
    <text x="64" y="40" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">Repositories</text>
  </g>
  <g transform="translate(${P + 140},120)">
    <rect width="128" height="48" rx="10" fill="#${accentColor}" opacity=".06"/>
    <text x="64" y="26" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="20" font-weight="700" fill="#${accentColor}">${followers}</text>
    <text x="64" y="40" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">Followers</text>
  </g>
  <g transform="translate(${P + 280},120)">
    <rect width="128" height="48" rx="10" fill="#8b5cf6" opacity=".06"/>
    <text x="64" y="26" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="20" font-weight="700" fill="#8b5cf6">${following}</text>
    <text x="64" y="40" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">Following</text>
  </g>

  <!-- Footer -->
  <line x1="${P}" y1="${H - 30}" x2="${W - P}" y2="${H - 30}" stroke="#30363d" stroke-width=".5"/>
  <text x="${P}" y="${H - 14}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">Joined ${joinStr}</text>
  <text x="${W - P}" y="${H - 14}" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">${yearsActive} years on GitHub</text>
</svg>`;
}

module.exports = { generateProfileSVG };
