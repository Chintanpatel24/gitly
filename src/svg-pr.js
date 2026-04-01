/**
 * SVG generation for Pull Request Stats card.
 */

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function generatePRCardSVG(options) {
  const { repoMap, totalPRs, openPRs = 0, colors, hideBorder, cardWidth = 460 } = options;
  const repos = Object.entries(repoMap).sort((a, b) => b[1] - a[1]);
  const maxShow = Math.min(repos.length, 12);
  const rowH = 30, pad = 24, hdr = 80;
  const cardHeight = hdr + maxShow * rowH + 8;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;

  let rows = "";
  repos.slice(0, maxShow).forEach(([repo, count], i) => {
    const y = hdr + i * rowH;
    const name = repo.length > 38 ? repo.substring(0, 35) + "..." : repo;
    const pct = Math.min((count / repos[0][1]) * 100, 100);
    const countLabel = String(count);
    const valueW = Math.max(24, countLabel.length * 9 + 6);
    const barW = 60;
    const barToValueGap = 12;
    const barX = cardWidth - pad - valueW - barToValueGap - barW;
    const valueX = cardWidth - pad;
    rows += `<g transform="translate(0,${y})">
      <rect width="${cardWidth}" height="${rowH}" fill="#e6edf3" opacity="${i % 2 === 0 ? '.02' : '0'}"/>
      <text x="${pad}" y="20" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" fill="#c9d1d9">${escapeXml(name)}</text>
      <rect x="${barX}" y="9" width="${barW}" height="12" rx="6" fill="#30363d"/>
      <rect x="${barX}" y="9" width="${pct * 0.6}" height="12" rx="6" fill="#${colors.accent_color}" opacity=".5"/>
      <text x="${valueX}" y="20" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="14" font-weight="700" fill="#${colors.accent_color}">${countLabel}</text>
    </g>`;
  });

  if (repos.length > maxShow) {
    rows += `<text x="${cardWidth / 2}" y="${hdr + maxShow * rowH + 6}" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e" opacity=".5">+${repos.length - maxShow} more</text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>.t{font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.n{font:700 18px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}</style>
  <rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
  <rect width="${cardWidth}" height="3" fill="#${colors.accent_color}" rx="8"/>
  <g transform="translate(${pad},10)">
    <circle cx="8" cy="18" r="5" fill="none" stroke="#${colors.accent_color}" stroke-width="1.5"/>
    <circle cx="8" cy="18" r="2" fill="#${colors.accent_color}"/>
    <line x1="14" y1="18" x2="18" y2="18" stroke="#${colors.accent_color}" stroke-width="1.5"/>
    <line x1="8" y1="24" x2="8" y2="30" stroke="#${colors.accent_color}" stroke-width="1.5"/>
    <text x="26" y="24" class="t" fill="#${colors.title_color}">Pull Requests</text>
  </g>
  <rect x="${cardWidth - pad - 70}" y="12" width="70" height="28" rx="12" fill="#${colors.accent_color}" opacity=".12"/>
  <text x="${cardWidth - pad - 35}" y="31" text-anchor="middle" class="n" fill="#${colors.accent_color}">${totalPRs}</text>
  <line x1="${pad}" y1="${hdr - 4}" x2="${cardWidth - pad}" y2="${hdr - 4}" stroke="#30363d" stroke-width=".5"/>
  ${rows}
</svg>`;
}

function generatePRSummarySVG(options) {
  const { totalPRs, openPRs = 0, repoCount, colors, hideBorder, cardWidth = 460, cardHeight = 165 } = options;
  const P = 24;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;
  const sw = (cardWidth - P * 2 - 24) / 3;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>.t{font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.n{font:700 42px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.l{font:400 11px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}</style>
  <rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
  <rect width="${cardWidth}" height="3" fill="#${colors.accent_color}" rx="8"/>
  <circle cx="${P + 8}" cy="22" r="5" fill="#${colors.accent_color}" opacity=".2"/><circle cx="${P + 8}" cy="22" r="2.5" fill="#${colors.accent_color}"/>
  <text x="${P + 18}" y="26" class="t" fill="#${colors.title_color}">Pull Requests</text>
  <line x1="${P}" y1="42" x2="${cardWidth - P}" y2="42" stroke="#30363d" stroke-width=".5"/>
  <g transform="translate(${P},52)"><rect width="${sw}" height="78" rx="8" fill="#${colors.accent_color}" opacity=".06"/><text x="${sw / 2}" y="40" text-anchor="middle" class="n" fill="#${colors.accent_color}">${totalPRs}</text><text x="${sw / 2}" y="58" text-anchor="middle" class="l" fill="#8b949e">Pull Requests</text></g>
  <g transform="translate(${P + sw + 12},52)"><rect width="${sw}" height="78" rx="8" fill="#${colors.accent_color}" opacity=".04"/><text x="${sw / 2}" y="40" text-anchor="middle" class="n" fill="#${colors.accent_color}">${openPRs}</text><text x="${sw / 2}" y="58" text-anchor="middle" class="l" fill="#8b949e">Open PRs</text></g>
  <g transform="translate(${P + (sw + 12) * 2},52)"><rect width="${sw}" height="78" rx="8" fill="#e6edf3" opacity=".04"/><text x="${sw / 2}" y="40" text-anchor="middle" class="n" fill="#e6edf3">${repoCount}</text><text x="${sw / 2}" y="58" text-anchor="middle" class="l" fill="#8b949e">Repositories</text></g>
</svg>`;
}

module.exports = { generatePRCardSVG, generatePRSummarySVG, escapeXml };
