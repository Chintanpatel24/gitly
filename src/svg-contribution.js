/**
 * Contribution Numbers Card SVG
 * Matches GitHub's exact grid layout:
 * - Columns = weeks (left to right)
 * - Rows = days of week (Sun at top, Sat at bottom)
 * - Each cell shows the contribution count for that day
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
 * Generate contribution grid SVG matching GitHub's exact layout.
 */
function generateContributionSVG(options) {
  const { username, days, totalContributions, colors, hideBorder, title } = options;

  if (!days || days.length === 0) {
    return noDataSVG(username, hideBorder);
  }

  const maxCount = Math.max(...days.map((d) => d.count), 1);

  // Build grid: each day goes to its correct (column, row) position
  // Column = week index, Row = day of week (0=Sun, 6=Sat)
  const grid = {};

  // Find the starting date's day of week
  const startDate = new Date(days[0].date + "T00:00:00");
  const startDayOfWeek = startDate.getDay(); // Should be 0 (Sun) based on data

  // Place each day in the grid
  for (let i = 0; i < days.length; i++) {
    const d = new Date(days[i].date + "T00:00:00");
    const dayOfWeek = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

    // Calculate which week column this day belongs to
    // Days are consecutive, so week = floor(i / 7)
    const weekIdx = Math.floor(i / 7);

    const key = `${weekIdx},${dayOfWeek}`;
    grid[key] = days[i];
  }

  const numWeeks = Math.ceil(days.length / 7);
  const cellSize = 11;
  const cellGap = 3;
  const cellStep = cellSize + cellGap;
  const padX = 32;
  const padY = 16;
  const labelWidth = 30;
  const headerHeight = 46;
  const gridWidth = numWeeks * cellStep;
  const gridHeight = 7 * cellStep;
  const cardWidth = Math.max(gridWidth + padX * 2 + labelWidth, 600);
  const cardHeight = headerHeight + gridHeight + padY + 40;

  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;
  const displayTitle = title || `${username}'s Contributions`;

  // Generate cells
  let cells = "";
  for (let weekIdx = 0; weekIdx < numWeeks; weekIdx++) {
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      const key = `${weekIdx},${dayOfWeek}`;
      const day = grid[key];
      if (!day) continue;

      const x = padX + labelWidth + weekIdx * cellStep;
      const y = headerHeight + padY + dayOfWeek * cellStep;
      const color = getContributionColor(day.count, maxCount);

      cells += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="#${color}"><title>${day.date}: ${day.count}</title></rect>`;

      if (day.count > 0) {
        const fs = day.count > 99 ? 5.5 : day.count > 9 ? 6.5 : 7.5;
        const tc = day.count / maxCount > 0.5 ? "0d1117" : "e6edf3";
        cells += `<text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 2}" text-anchor="middle" font-family="monospace" font-size="${fs}" font-weight="700" fill="#${tc}" pointer-events="none">${day.count}</text>`;
      }
    }
  }

  // Day labels on left (Sun, Mon, Wed, Fri) - matching GitHub
  const dayLabels = ["Sun", "", "Tue", "", "Thu", "", "Sat"];
  let labels = "";
  dayLabels.forEach((label, idx) => {
    if (!label) return;
    const y = headerHeight + padY + idx * cellStep + cellSize / 2 + 3;
    labels += `<text x="${padX + labelWidth - 4}" y="${y}" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" fill="#8b949e">${label}</text>`;
  });

  // Month labels above grid
  let monthLabels = "";
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let lastMonth = -1;

  for (let weekIdx = 0; weekIdx < numWeeks; weekIdx++) {
    // Find the first day in this week column
    for (let dow = 0; dow < 7; dow++) {
      const key = `${weekIdx},${dow}`;
      if (grid[key]) {
        const d = new Date(grid[key].date + "T00:00:00");
        const month = d.getMonth();
        if (month !== lastMonth) {
          const x = padX + labelWidth + weekIdx * cellStep;
          monthLabels += `<text x="${x}" y="${headerHeight + padY - 6}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" fill="#8b949e">${monthNames[month]}</text>`;
          lastMonth = month;
        }
        break;
      }
    }
  }

  // Legend
  const legendX = padX + labelWidth;
  const legendY = headerHeight + padY + gridHeight + 20;
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
${monthLabels}${labels}${cells}${legend}
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
