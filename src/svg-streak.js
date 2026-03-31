/**
 * Streak Card SVG generation
 * Shows current and longest contribution streaks with fire visuals.
 */

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function generateStreakSVG(options) {
  const { username, currentStreak = 0, longestStreak = 0, totalContributions = 0, colors, hideBorder } = options;

  const W = 460, H = 190, P = 24;
  const hba = hideBorder ? `rx="10"` : `rx="10" stroke="#30363d" stroke-width="1"`;

  const accentColor = (colors && colors.accent_color) || "f97316";
  const titleColor = (colors && colors.title_color) || "e6edf3";

  const streakLevel = currentStreak >= 100 ? "legendary" : currentStreak >= 30 ? "on-fire" : currentStreak >= 7 ? "heating-up" : "warming-up";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="streakGrad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" style="stop-color:#f97316;stop-opacity:0.05"/>
      <stop offset="100%" style="stop-color:#f97316;stop-opacity:0"/>
    </linearGradient>
    <linearGradient id="fireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" style="stop-color:#f97316;stop-opacity:0.3"/>
      <stop offset="50%" style="stop-color:#ef4444;stop-opacity:0.2"/>
      <stop offset="100%" style="stop-color:#eab308;stop-opacity:0.1"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#0d1117" ${hba}/>
  <rect width="${W}" height="4" fill="#f97316" rx="10"/>
  <rect x="0" y="4" width="${W}" height="${H}" fill="url(#streakGrad)"/>

  <!-- Header -->
  <g transform="translate(${P},16)">
    <rect width="32" height="32" rx="8" fill="#f97316" opacity=".15"/>
    <text x="16" y="24" text-anchor="middle" font-size="18">&#x1F525;</text>
    <text x="42" y="22" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="16" font-weight="700" fill="#${titleColor}">${escapeXml(username)}'s Streak</text>
    <text x="42" y="36" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">${streakLevel.replace("-", " ")}</text>
  </g>

  <!-- Current Streak (big) -->
  <g transform="translate(${P},62)">
    <rect width="200" height="108" rx="12" fill="#f97316" opacity=".06"/>
    <rect width="200" height="108" rx="12" fill="none" stroke="#f97316" stroke-opacity=".12" stroke-width="1"/>
    <text x="100" y="40" text-anchor="middle" font-size="28">&#x1F525;</text>
    <text x="100" y="72" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="40" font-weight="800" fill="#f97316">${currentStreak}</text>
    <text x="100" y="92" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" fill="#8b949e">Current Streak (days)</text>
  </g>

  <!-- Longest Streak -->
  <g transform="translate(${P + 216},62)">
    <rect width="110" height="50" rx="10" fill="#eab308" opacity=".06"/>
    <rect width="110" height="50" rx="10" fill="none" stroke="#eab308" stroke-opacity=".12" stroke-width="1"/>
    <text x="55" y="28" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="22" font-weight="800" fill="#eab308">${longestStreak}</text>
    <text x="55" y="44" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" fill="#8b949e">Longest Streak</text>
  </g>

  <!-- Total Contributions -->
  <g transform="translate(${P + 338},62)">
    <rect width="100" height="50" rx="10" fill="#39d353" opacity=".06"/>
    <rect width="100" height="50" rx="10" fill="none" stroke="#39d353" stroke-opacity=".12" stroke-width="1"/>
    <text x="50" y="28" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="18" font-weight="800" fill="#39d353">${totalContributions.toLocaleString()}</text>
    <text x="50" y="44" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" fill="#8b949e">Total</text>
  </g>

  <!-- Progress bar -->
  <g transform="translate(${P + 216},122)">
    <rect width="222" height="8" rx="4" fill="#30363d"/>
    <rect width="${Math.min(222, (currentStreak / Math.max(longestStreak, 1)) * 222)}" height="8" rx="4" fill="#f97316"/>
    <text x="0" y="24" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" fill="#8b949e">${Math.round((currentStreak / Math.max(longestStreak, 1)) * 100)}% of best</text>
  </g>

  <!-- Footer -->
  <line x1="${P}" y1="${H - 18}" x2="${W - P}" y2="${H - 18}" stroke="#30363d" stroke-width=".5"/>
  <text x="${W / 2}" y="${H - 6}" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" fill="#484f58">Keep the streak alive!</text>
</svg>`;
}

module.exports = { generateStreakSVG };
