/**
 * Streak Card SVG generation
 * Classic clean design with current and longest streak.
 */

function generateStreakSVG(options) {
  const { currentStreak = 0, longestStreak = 0, totalContributions = 0, colors, hideBorder } = options;

  const W = 460, H = 160, P = 24;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;

  const accentColor = (colors && colors.accent_color) || "58a6ff";

  const pct = longestStreak > 0 ? Math.round((currentStreak / longestStreak) * 100) : 0;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <style>.t{font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.n{font:700 42px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.l{font:400 11px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.m{font:700 24px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}</style>
  <rect width="${W}" height="${H}" fill="#0d1117" ${hba}/>
  <rect width="${W}" height="3" fill="#${accentColor}" rx="8"/>
  <circle cx="${P + 6}" cy="22" r="5" fill="#${accentColor}" opacity=".2"/><circle cx="${P + 6}" cy="22" r="2.5" fill="#${accentColor}"/>
  <text x="${P + 16}" y="26" class="t" fill="#e6edf3">Streak</text>
  <line x1="${P}" y1="40" x2="${W - P}" y2="40" stroke="#30363d" stroke-width=".5"/>
  <g transform="translate(${P},50)"><rect width="200" height="80" rx="8" fill="#${accentColor}" opacity=".06"/><text x="100" y="42" text-anchor="middle" class="n" fill="#${accentColor}">${currentStreak}</text><text x="100" y="62" text-anchor="middle" class="l" fill="#8b949e">Current Streak</text></g>
  <g transform="translate(${P + 212},50)"><rect width="108" height="38" rx="8" fill="#e6edf3" opacity=".04"/><text x="54" y="26" text-anchor="middle" class="m" fill="#e6edf3">${longestStreak}</text><text x="54" y="36" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="8" fill="#8b949e">Best Streak</text></g>
  <g transform="translate(${P + 332},50)"><rect width="108" height="38" rx="8" fill="#39d353" opacity=".06"/><text x="54" y="26" text-anchor="middle" class="m" fill="#39d353">${totalContributions.toLocaleString()}</text><text x="54" y="36" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="8" fill="#8b949e">Total</text></g>
  <g transform="translate(${P + 212},96)">
    <rect width="228" height="6" rx="3" fill="#30363d"/>
    <rect width="${Math.min(228, pct * 2.28)}" height="6" rx="3" fill="#${accentColor}"/>
    <text x="0" y="18" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" fill="#8b949e">${pct}% of best streak</text>
  </g>
</svg>`;
}

module.exports = { generateStreakSVG };
