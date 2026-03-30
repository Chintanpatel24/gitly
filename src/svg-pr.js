/**
 * SVG generation for Pull Request Stats card.
 */

const { applyColorOverrides, getTheme } = require("./themes");

/**
 * Generate an SVG card showing PR counts per repository.
 * @param {Object} options
 * @param {string} options.username
 * @param {Object} options.repoMap - { repoName: prCount }
 * @param {number} options.totalPRs
 * @param {Object} options.colors - { bg_color, title_color, text_color, border_color }
 * @param {string} options.title - Custom title text
 * @param {boolean} options.hideBorder
 * @param {number} options.cardWidth
 * @returns {string} SVG markup
 */
function generatePRCardSVG(options) {
  const {
    username,
    repoMap,
    totalPRs,
    colors,
    title,
    hideBorder,
    cardWidth = 420,
  } = options;

  const repos = Object.entries(repoMap).sort((a, b) => b[1] - a[1]);
  const rowHeight = 24;
  const padding = 30;
  const headerHeight = 50;
  const footerHeight = 20;
  const cardHeight = headerHeight + repos.length * rowHeight + footerHeight + padding;

  let repoRows = "";
  repos.forEach(([repo, count], index) => {
    const y = headerHeight + padding + index * rowHeight;
    const barWidth = Math.min((count / totalPRs) * 200, 200);

    repoRows += `
      <g transform="translate(${padding}, ${y})">
        <text x="0" y="14" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="13" fill="#${colors.text_color}">
          ${escapeXml(repo.length > 35 ? repo.substring(0, 32) + "..." : repo)}
        </text>
        <text x="${cardWidth - padding * 2 - 10}" y="14" text-anchor="end" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="13" font-weight="600" fill="#${colors.accent_color}">
          ${count} PR${count !== 1 ? "s" : ""}
        </text>
      </g>`;
  });

  const border = hideBorder
    ? ""
    : `rx="4.5" stroke="#${colors.border_color}" stroke-width="1"`;

  const displayTitle = title || `${username}'s Pull Requests`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>
    .header { font: 600 16px 'Segoe UI', Ubuntu, sans-serif; }
    .total { font: 400 12px 'Segoe UI', Ubuntu, sans-serif; }
  </style>
  <rect x="0.5" y="0.5" width="${cardWidth - 1}" height="${cardHeight - 1}" fill="#${colors.bg_color}" ${border}/>
  <text x="${padding}" y="30" class="header" fill="#${colors.title_color}">${escapeXml(displayTitle)}</text>
  <text x="${cardWidth - padding}" y="30" text-anchor="end" class="total" fill="#${colors.text_color}">Total: ${totalPRs}</text>
  ${repoRows}
</svg>`;
}

/**
 * Generate a small compact PR summary card.
 * @param {Object} options
 * @returns {string} SVG markup
 */
function generatePRSummarySVG(options) {
  const { username, totalPRs, repoCount, colors, hideBorder, cardWidth = 380, cardHeight = 155 } = options;

  const border = hideBorder
    ? ""
    : `rx="4.5" stroke="#${colors.border_color}" stroke-width="1"`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>
    .header { font: 600 16px 'Segoe UI', Ubuntu, sans-serif; }
    .stat-number { font: 700 32px 'Segoe UI', Ubuntu, sans-serif; }
    .stat-label { font: 400 12px 'Segoe UI', Ubuntu, sans-serif; }
    .icon { fill: #${colors.accent_color}; }
  </style>
  <rect x="0.5" y="0.5" width="${cardWidth - 1}" height="${cardHeight - 1}" fill="#${colors.bg_color}" ${border}/>

  <!-- Title -->
  <text x="${padding}" y="32" class="header" fill="#${colors.title_color}">${escapeXml(username)}'s Pull Requests</text>

  <!-- PR Icon -->
  <g transform="translate(${padding}, 50)">
    <svg class="icon" width="24" height="24" viewBox="0 0 16 16">
      <path fill="#${colors.accent_color}" d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"/>
    </svg>
  </g>

  <!-- Total PRs -->
  <text x="${padding + 34}" y="72" class="stat-number" fill="#${colors.text_color}">${totalPRs}</text>
  <text x="${padding + 34}" y="88" class="stat-label" fill="#${colors.text_color}">Total Pull Requests</text>

  <!-- Repos count -->
  <text x="${cardWidth / 2 + 20}" y="72" class="stat-number" fill="#${colors.text_color}">${repoCount}</text>
  <text x="${cardWidth / 2 + 20}" y="88" class="stat-label" fill="#${colors.text_color}">Repositories</text>

  <!-- Divider line -->
  <line x1="${cardWidth / 2}" y1="52" x2="${cardWidth / 2}" y2="92" stroke="#${colors.border_color}" stroke-width="1" stroke-dasharray="4"/>

  <!-- Footer -->
  <text x="${cardWidth / 2}" y="${cardHeight - 14}" text-anchor="middle" class="stat-label" fill="#${colors.text_color}" opacity="0.6">via gitly</text>
</svg>`;
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const padding = 25;

module.exports = { generatePRCardSVG, generatePRSummarySVG, escapeXml };
