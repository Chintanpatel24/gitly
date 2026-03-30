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

function getLevelFromCount(count) {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

function getContributionColorForDay(day, maxCount) {
  const level = typeof day.level === "number" ? day.level : getLevelFromCount(day.count);
  const levelColors = ["161b22", "0e4429", "006d32", "26a641", "39d353"];
  if (level >= 0 && level <= 4) return levelColors[level];
  return getContributionColor(day.count, maxCount);
}

/**
 * Generate contribution grid SVG.
 * Layout: GitHub-like weekly columns (left->right) and weekday rows (top->bottom).
 */
function generateContributionSVG(options) {
  const { username, days, totalContributions, colors, hideBorder, title } = options;

  if (!days || days.length === 0) {
    return noDataSVG(username, hideBorder);
  }

  const maxCount = Math.max(...days.map((d) => d.count), 1);

  const cellSize = 11;
  const cellGap = 3;
  const cellStep = cellSize + cellGap;
  const padX = 16;
  const padY = 16;
  const headerHeight = 54;

  const sortedDays = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const firstDate = new Date(`${sortedDays[0].date}T00:00:00`);
  const lastDate = new Date(`${sortedDays[sortedDays.length - 1].date}T00:00:00`);

  // Align first visible week to Sunday, matching GitHub's graph structure.
  const startSunday = new Date(firstDate);
  startSunday.setDate(startSunday.getDate() - startSunday.getDay());

  const msPerDay = 24 * 60 * 60 * 1000;
  const totalDays = Math.floor((lastDate - startSunday) / msPerDay) + 1;
  const weekCount = Math.max(1, Math.ceil(totalDays / 7));
  const weekdayRowCount = 7;

  const weekdayLabelW = 22;
  const gridStartX = padX + weekdayLabelW;
  const gridStartY = headerHeight + padY;

  const gridWidth = weekCount * cellStep;
  const gridHeight = weekdayRowCount * cellStep;
  const cardWidth = Math.max(gridStartX + gridWidth + padX, 600);
  const cardHeight = headerHeight + gridHeight + padY + 40;

  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;
  const displayTitle = title || `${username}'s Contributions`;

  // Generate cells in GitHub's week-column layout.
  let cells = "";
  for (let i = 0; i < sortedDays.length; i++) {
    const dateObj = new Date(`${sortedDays[i].date}T00:00:00`);
    const diffDays = Math.floor((dateObj - startSunday) / msPerDay);
    const col = Math.floor(diffDays / 7);
    const row = dateObj.getDay();
    const x = gridStartX + col * cellStep;
    const y = gridStartY + row * cellStep;
    const color = getContributionColorForDay(sortedDays[i], maxCount);

    cells += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="#${color}"><title>${sortedDays[i].date}: ${sortedDays[i].count}</title></rect>`;

    const fs = sortedDays[i].count > 99 ? 5.5 : sortedDays[i].count > 9 ? 6.5 : 7.2;
    const tc = sortedDays[i].count === 0 ? "8b949e" : sortedDays[i].count / maxCount > 0.5 ? "0d1117" : "e6edf3";
    const op = sortedDays[i].count === 0 ? ".55" : "1";
    cells += `<text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 2}" text-anchor="middle" font-family="monospace" font-size="${fs}" font-weight="700" fill="#${tc}" opacity="${op}" pointer-events="none">${sortedDays[i].count}</text>`;
  }

  // Month labels across the top, similar to GitHub.
  let monthLabels = "";
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let prevMonth = -1;
  for (let c = 0; c < weekCount; c++) {
    const weekDate = new Date(startSunday);
    weekDate.setDate(startSunday.getDate() + c * 7);
    const month = weekDate.getMonth();
    if (month !== prevMonth) {
      monthLabels += `<text x="${gridStartX + c * cellStep}" y="${gridStartY - 8}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" fill="#8b949e">${monthNames[month]}</text>`;
      prevMonth = month;
    }
  }

  // Weekday labels on the left (Mon, Wed, Fri), like GitHub.
  const weekdayLabels = [
    { row: 1, label: "Mon" },
    { row: 3, label: "Wed" },
    { row: 5, label: "Fri" },
  ]
    .map(({ row, label }) => {
      const y = gridStartY + row * cellStep + cellSize / 2 + 3;
      return `<text x="${gridStartX - 6}" y="${y}" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="8" fill="#8b949e">${label}</text>`;
    })
    .join("");

  // Legend
  const legendX = gridStartX;
  const legendY = gridStartY + gridHeight + 18;
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
${monthLabels}${weekdayLabels}${cells}${legend}
</svg>`;
}

/**
 * Pulse graph card with monthly bars + 30-day trend line.
 */
function generateContributionPulseSVG(options) {
  const { username, days, totalContributions, hideBorder, title } = options;

  if (!days || days.length === 0) {
    return noDataSVG(username, hideBorder);
  }

  const sortedDays = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const cardWidth = 780;
  const cardHeight = 250;
  const padX = 24;
  const headerY = 30;
  const chartX = padX;
  const chartY = 62;
  const chartW = cardWidth - padX * 2;
  const barAreaH = 108;
  const trendY = 190;
  const trendH = 36;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;
  const displayTitle = title || `${username}'s Contribution Pulse`;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthMap = new Map();
  sortedDays.forEach((d) => {
    const dt = new Date(`${d.date}T00:00:00`);
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
    const cur = monthMap.get(key) || { label: `${monthNames[dt.getMonth()]} ${String(dt.getFullYear()).slice(-2)}`, total: 0 };
    cur.total += d.count;
    monthMap.set(key, cur);
  });

  const months = Array.from(monthMap.values());
  const maxMonth = Math.max(...months.map((m) => m.total), 1);
  const barGap = 8;
  const barW = Math.max(10, (chartW - barGap * (months.length - 1)) / Math.max(months.length, 1));

  let bars = "";
  months.forEach((m, i) => {
    const h = Math.max(2, (m.total / maxMonth) * barAreaH);
    const x = chartX + i * (barW + barGap);
    const y = chartY + barAreaH - h;
    bars += `<rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="3" fill="#39d353" opacity="${0.35 + (m.total / maxMonth) * 0.65}"><title>${m.label}: ${m.total} commits</title></rect>`;
    if (i % 2 === 0 || months.length <= 8) {
      bars += `<text x="${x + barW / 2}" y="${chartY + barAreaH + 13}" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" fill="#8b949e">${m.label.split(" ")[0]}</text>`;
    }
  });

  const last30 = sortedDays.slice(-30);
  const max30 = Math.max(...last30.map((d) => d.count), 1);
  const stepX = last30.length > 1 ? chartW / (last30.length - 1) : 0;
  let trendPath = "";
  let trendDots = "";
  last30.forEach((d, i) => {
    const x = chartX + i * stepX;
    const y = trendY + trendH - (d.count / max30) * trendH;
    trendPath += `${i === 0 ? "M" : "L"}${x},${y} `;
    trendDots += `<circle cx="${x}" cy="${y}" r="2" fill="#58a6ff"><title>${d.date}: ${d.count} commits</title></circle>`;
  });

  const activeDays = sortedDays.filter((d) => d.count > 0).length;
  const avg = (totalContributions / sortedDays.length).toFixed(2);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
<style>.t{font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.m{font:500 11px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.n{font:700 12px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}</style>
<rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
<rect width="${cardWidth}" height="3" fill="#39d353" rx="8"/>
<text x="${padX}" y="${headerY}" class="t" fill="#e6edf3">${escapeXml(displayTitle)}</text>
<rect x="${cardWidth - 250}" y="14" width="226" height="24" rx="12" fill="#39d353" opacity=".12"/>
<text x="${cardWidth - 137}" y="30" text-anchor="middle" class="m" fill="#39d353">${totalContributions} total commits</text>
<line x1="${chartX}" y1="${chartY + barAreaH}" x2="${chartX + chartW}" y2="${chartY + barAreaH}" stroke="#30363d" stroke-width=".8"/>
${bars}
<text x="${chartX}" y="${trendY - 10}" class="n" fill="#58a6ff">Last 30 days trend</text>
<path d="${trendPath.trim()}" fill="none" stroke="#58a6ff" stroke-width="2"/>
${trendDots}
<text x="${chartX}" y="${cardHeight - 12}" class="m" fill="#8b949e">Active days: ${activeDays} / ${sortedDays.length}</text>
<text x="${cardWidth - padX}" y="${cardHeight - 12}" text-anchor="end" class="m" fill="#8b949e">Avg/day: ${avg}</text>
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

module.exports = {
  generateContributionSVG,
  generateContributionSummarySVG,
  generateContributionPulseSVG,
  getContributionColor,
};
