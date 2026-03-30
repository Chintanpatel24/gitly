/**
 * SVG generation for Contribution Numbers Card.
 * Displays commit counts per day in a GitHub-style grid,
 * but with actual numbers instead of colored dots.
 */

const { escapeXml } = require("./svg-pr");

/**
 * Get the green color based on contribution count (GitHub dark theme style).
 * @param {number} count
 * @param {number} maxCount
 * @returns {string} hex color
 */
function getContributionColor(count, maxCount) {
  if (count === 0) return "161b22";
  const ratio = count / maxCount;
  if (ratio <= 0.25) return "0e4429";
  if (ratio <= 0.5) return "006d32";
  if (ratio <= 0.75) return "26a641";
  return "39d353";
}

/**
 * Generate the contribution numbers grid SVG.
 * @param {Object} options
 * @param {string} options.username
 * @param {Array} options.days - [{ date, count }]
 * @param {number} options.totalContributions
 * @param {Object} options.colors - theme colors
 * @param {boolean} options.hideBorder
 * @param {string} options.title
 * @returns {string} SVG markup
 */
function generateContributionSVG(options) {
  const {
    username,
    days,
    totalContributions,
    colors,
    hideBorder,
    title,
  } = options;

  const maxCount = Math.max(...days.map((d) => d.count), 1);

  // Group days by week for the grid layout
  const weeks = [];
  let currentWeek = [];

  // Pad the beginning so the first day aligns to its weekday
  if (days.length > 0) {
    const firstDay = new Date(days[0].date + "T00:00:00");
    const dayOfWeek = firstDay.getDay(); // 0=Sun
    for (let i = 0; i < dayOfWeek; i++) {
      currentWeek.push(null);
    }
  }

  for (const day of days) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const cellSize = 16;
  const cellGap = 3;
  const cellStep = cellSize + cellGap;
  const padding = 30;
  const headerHeight = 50;
  const labelWidth = 30;
  const gridWidth = weeks.length * cellStep;
  const gridHeight = 7 * cellStep;
  const cardWidth = Math.max(gridWidth + padding * 2 + labelWidth, 600);
  const cardHeight = headerHeight + gridHeight + padding * 2 + 30;

  let cells = "";
  let tooltipData = [];

  weeks.forEach((week, weekIdx) => {
    week.forEach((day, dayIdx) => {
      if (!day) return;
      const x = padding + labelWidth + weekIdx * cellStep;
      const y = headerHeight + padding + dayIdx * cellStep;
      const color = getContributionColor(day.count, maxCount);

      cells += `
      <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="#${color}" class="contribution-cell" data-date="${day.date}" data-count="${day.count}">
        <title>${day.date}: ${day.count} contribution${day.count !== 1 ? "s" : ""}</title>
      </rect>`;

      // Show number inside cell if count > 0
      if (day.count > 0) {
        const fontSize = day.count > 99 ? 7 : day.count > 9 ? 8 : 9;
        const textColor = day.count / maxCount > 0.5 ? "0d1117" : "ffffff";
        cells += `
      <text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 3}" text-anchor="middle" font-family="'Segoe UI', Ubuntu, monospace" font-size="${fontSize}" font-weight="600" fill="#${textColor}" pointer-events="none">${day.count}</text>`;
      }
    });
  });

  // Day labels
  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];
  let labels = "";
  dayLabels.forEach((label, idx) => {
    if (!label) return;
    const y = headerHeight + padding + idx * cellStep + cellSize / 2 + 3;
    labels += `<text x="${padding}" y="${y}" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="10" fill="#${colors.text_color}" opacity="0.7">${label}</text>`;
  });

  // Month labels at the top of the grid
  let monthLabels = "";
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let lastMonth = -1;
  weeks.forEach((week, weekIdx) => {
    const firstDay = week.find((d) => d !== null);
    if (firstDay) {
      const month = new Date(firstDay.date + "T00:00:00").getMonth();
      if (month !== lastMonth) {
        const x = padding + labelWidth + weekIdx * cellStep;
        monthLabels += `<text x="${x}" y="${headerHeight + padding - 6}" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="10" fill="#${colors.text_color}" opacity="0.7">${monthNames[month]}</text>`;
        lastMonth = month;
      }
    }
  });

  const border = hideBorder
    ? ""
    : `rx="4.5" stroke="#${colors.border_color}" stroke-width="1"`;

  const displayTitle = title || `${username}'s Contributions`;

  // Legend
  const legendX = cardWidth - padding - 180;
  const legendY = cardHeight - padding - 5;
  const legendColors = ["161b22", "0e4429", "006d32", "26a641", "39d353"];
  let legend = `<text x="${legendX}" y="${legendY}" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="10" fill="#${colors.text_color}" opacity="0.7">Less</text>`;
  legendColors.forEach((color, idx) => {
    const lx = legendX + 30 + idx * (cellSize + 3);
    legend += `<rect x="${lx}" y="${legendY - 10}" width="${cellSize - 2}" height="${cellSize - 2}" rx="2" fill="#${color}"/>`;
  });
  legend += `<text x="${legendX + 30 + 5 * (cellSize + 3) + 4}" y="${legendY}" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="10" fill="#${colors.text_color}" opacity="0.7">More</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>
    .header { font: 600 16px 'Segoe UI', Ubuntu, sans-serif; }
    .total { font: 400 12px 'Segoe UI', Ubuntu, sans-serif; }
    .contribution-cell:hover { stroke: #${colors.text_color}; stroke-width: 1; opacity: 0.8; }
  </style>
  <rect x="0.5" y="0.5" width="${cardWidth - 1}" height="${cardHeight - 1}" fill="#${colors.bg_color}" ${border}/>

  <!-- Title -->
  <text x="${padding}" y="30" class="header" fill="#${colors.title_color}">${escapeXml(displayTitle)}</text>
  <text x="${cardWidth - padding}" y="30" text-anchor="end" class="total" fill="#${colors.text_color}">Total: ${totalContributions} contributions</text>

  <!-- Day labels -->
  ${labels}

  <!-- Month labels -->
  ${monthLabels}

  <!-- Contribution cells -->
  ${cells}

  <!-- Legend -->
  ${legend}

  <!-- Footer -->
  <text x="${cardWidth / 2}" y="${cardHeight - 8}" text-anchor="middle" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="10" fill="#${colors.text_color}" opacity="0.4">via gitly</text>
</svg>`;
}

/**
 * Generate a compact contribution summary card (stats only, no grid).
 * @param {Object} options
 * @returns {string} SVG markup
 */
function generateContributionSummarySVG(options) {
  const { username, totalContributions, currentStreak, longestStreak, colors, hideBorder } = options;

  const cardWidth = 400;
  const cardHeight = 155;
  const padding = 25;

  const border = hideBorder
    ? ""
    : `rx="4.5" stroke="#${colors.border_color}" stroke-width="1"`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>
    .header { font: 600 16px 'Segoe UI', Ubuntu, sans-serif; }
    .stat-number { font: 700 28px 'Segoe UI', Ubuntu, sans-serif; }
    .stat-label { font: 400 11px 'Segoe UI', Ubuntu, sans-serif; }
  </style>
  <rect x="0.5" y="0.5" width="${cardWidth - 1}" height="${cardHeight - 1}" fill="#${colors.bg_color}" ${border}/>

  <text x="${padding}" y="32" class="header" fill="#${colors.title_color}">${escapeXml(username)}'s Contributions</text>

  <!-- Total -->
  <text x="${padding}" y="75" class="stat-number" fill="#${colors.text_color}">${totalContributions}</text>
  <text x="${padding}" y="92" class="stat-label" fill="#${colors.text_color}">Total</text>

  <!-- Current Streak -->
  <text x="${cardWidth / 2}" y="75" text-anchor="middle" class="stat-number" fill="#${colors.accent_color}">${currentStreak}</text>
  <text x="${cardWidth / 2}" y="92" text-anchor="middle" class="stat-label" fill="#${colors.text_color}">Current Streak</text>

  <!-- Longest Streak -->
  <text x="${cardWidth - padding}" y="75" text-anchor="end" class="stat-number" fill="#${colors.text_color}">${longestStreak}</text>
  <text x="${cardWidth - padding}" y="92" text-anchor="end" class="stat-label" fill="#${colors.text_color}">Longest Streak</text>

  <!-- Dividers -->
  <line x1="${cardWidth / 3}" y1="52" x2="${cardWidth / 3}" y2="98" stroke="#${colors.border_color}" stroke-width="1" stroke-dasharray="4" opacity="0.5"/>
  <line x1="${(cardWidth * 2) / 3}" y1="52" x2="${(cardWidth * 2) / 3}" y2="98" stroke="#${colors.border_color}" stroke-width="1" stroke-dasharray="4" opacity="0.5"/>

  <text x="${cardWidth / 2}" y="${cardHeight - 14}" text-anchor="middle" class="stat-label" fill="#${colors.text_color}" opacity="0.6">via gitly</text>
</svg>`;
}

module.exports = {
  generateContributionSVG,
  generateContributionSummarySVG,
  getContributionColor,
};
