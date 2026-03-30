/**
 * Contribution Numbers Card SVG
 * Simple horizontal layout - days flow left to right, wrap to next row
 */

const { escapeXml } = require("./svg-pr");

function getContributionColor(count, maxCount) {
  if (count === 0) return "161b22";
  const ratio = count / maxCount;
  if (ratio <= 0.25) return "0e4429";
  if (ratio <= 0.5) return "006d32";
  if (ratio <= 0.75) return "26a641";
  return "39d353";
}

/**
 * Generate contribution grid SVG.
 * Layout: days flow left to right, wrapping to next row.
 * Like reading text - left to right, top to bottom.
 */
function generateContributionSVG(options) {
  const { username, days, totalContributions, colors, hideBorder, title } = options;

  if (!days || days.length === 0) {
    return noDataSVG(username, hideBorder);
  }

  const maxCount = Math.max(...days.map((d) => d.count), 1);

  // How many cells per row
  const cellsPerRow = 53;
  const cellSize = 11;
  const cellGap = 3;
  const cellStep = cellSize + cellGap;
  const padX = 28;
  const padY = 16;
  const headerHeight = 46;
  const numRows = Math.ceil(days.length / cellsPerRow);
  const gridWidth = cellsPerRow * cellStep;
  const gridHeight = numRows * cellStep;
  const cardWidth = Math.max(gridWidth + padX * 2, 600);
  const cardHeight = headerHeight + gridHeight + padY + 40;

  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;
  const displayTitle = title || `${username}'s Contributions`;

  // Generate cells - simple left to right, top to bottom
  let cells = "";
  for (let i = 0; i < days.length; i++) {
    const col = i % cellsPerRow;
    const row = Math.floor(i / cellsPerRow);
    const x = padX + col * cellStep;
    const y = headerHeight + padY + row * cellStep;
    const color = getContributionColor(days[i].count, maxCount);

    cells += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="#${color}"><title>${days[i].date}: ${days[i].count}</title></rect>`;

    if (days[i].count > 0) {
      const fs = days[i].count > 99 ? 5.5 : days[i].count > 9 ? 6.5 : 7.5;
      const tc = days[i].count / maxCount > 0.5 ? "0d1117" : "e6edf3";
      cells += `<text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 2}" text-anchor="middle" font-family="monospace" font-size="${fs}" font-weight="700" fill="#${tc}" pointer-events="none">${days[i].count}</text>`;
    }
  }

  // Row labels showing date ranges
  let rowLabels = "";
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (let r = 0; r < numRows; r++) {
    const startIdx = r * cellsPerRow;
    if (startIdx < days.length) {
      const d = new Date(days[startIdx].date + "T00:00:00");
      const label = `${monthNames[d.getMonth()]} ${d.getDate()}`;
      const y = headerHeight + padY + r * cellStep + cellSize / 2 + 3;
      rowLabels += `<text x="${padX - 4}" y="${y}" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="8" fill="#8b949e">${label}</text>`;
    }
  }

  // Legend
  const legendX = padX;
  const legendY = headerHeight + padY + gridHeight + 18;
  const legColors = ["161b22", "0e4429", "006d32", "26a641", "39d353"];
  let legend = `<text x="${legendX}" y="${legendY}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" fill="#8b949e">Less</text>`;
  legColors.forEach((c, i) => {
    legend += `<rect x="${legendX + 28 + i * (cellSize + 2)}" y="${legendY - 8}" width="${cellSize - 1}" height="${cellSize - 1}" rx="2" fill="#${c}"/>`;
  });
  legend += `<text x="${legendX + 28 + 5 * (cellSize + 2) + 4}" y="${legendY}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" fill="#8b949e">More</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
<style>.t{font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.b{font:500 11px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}</style>
<rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
<rect width="${cardWidth}" height="3" fill="#39d353" rx="8"/>
<circle cx="${padX + 8}" cy="24" r="6" fill="#39d353" opacity=".15"/><circle cx="${padX + 8}" cy="24" r="3" fill="#39d353"/>
<text x="${padX + 20}" y="28" class="t" fill="#${colors.title_color || 'e6edf3'}">${escapeXml(displayTitle)}</text>
<rect x="${cardWidth - padX - 180}" y="12" width="180" height="22" rx="11" fill="#39d353" opacity=".12"/>
<text x="${cardWidth - padX - 90}" y="27" text-anchor="middle" class="b" fill="#39d353">${totalContributions} contributions</text>
<line x1="${padX}" y1="${headerHeight}" x2="${cardWidth - padX}" y2="${headerHeight}" stroke="#30363d" stroke-width=".5"/>
${rowLabels}${cells}${legend}
</svg>`;
}

/**
 * Compact contribution summary card.
 */
function generateContributionSummarySVG(options) {
  const { username, totalContributions, currentStreak, longestStreak, colors, hideBorder } = options;
  const W = 420, H = 170, P = 24;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<style>.t{font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.n{font:700 30px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.l{font:400 11px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}</style>
<rect width="${W}" height="${H}" fill="#0d1117" ${hba}/>
<rect width="${W}" height="3" fill="#39d353" rx="8"/>
<circle cx="${P + 8}" cy="24" r="6" fill="#39d353" opacity=".15"/><circle cx="${P + 8}" cy="24" r="3" fill="#39d353"/>
<text x="${P + 20}" y="28" class="t" fill="#e6edf3">${escapeXml(username)}'s Contributions</text>
<line x1="${P}" y1="46" x2="${W - P}" y2="46" stroke="#30363d" stroke-width=".5"/>
<g transform="translate(${P},56)"><rect width="115" height="80" rx="8" fill="#39d353" opacity=".06"/><text x="57" y="38" text-anchor="middle" class="n" fill="#39d353">${totalContributions}</text><text x="57" y="56" text-anchor="middle" class="l" fill="#8b949e">Total</text></g>
<g transform="translate(${P + 127},56)"><rect width="115" height="80" rx="8" fill="#58a6ff" opacity=".06"/><text x="57" y="38" text-anchor="middle" class="n" fill="#58a6ff">${currentStreak}</text><text x="57" y="56" text-anchor="middle" class="l" fill="#8b949e">Current Streak</text></g>
<g transform="translate(${P + 254},56)"><rect width="115" height="80" rx="8" fill="#e6edf3" opacity=".04"/><text x="57" y="38" text-anchor="middle" class="n" fill="#e6edf3">${longestStreak}</text><text x="57" y="56" text-anchor="middle" class="l" fill="#8b949e">Longest Streak</text></g>
</svg>`;
}

function noDataSVG(username, hideBorder) {
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120" viewBox="0 0 400 120">
<rect width="400" height="120" fill="#0d1117" ${hba}/>
<text x="200" y="55" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="14" fill="#e6edf3">${escapeXml(username)}'s Contributions</text>
<text x="200" y="78" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="11" fill="#8b949e">No data found</text>
</svg>`;
}

module.exports = { generateContributionSVG, generateContributionSummarySVG, getContributionColor };
