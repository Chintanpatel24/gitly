/**
 * SVG generation for Contribution Numbers Card.
 * Always uses dark background. Layout matches GitHub exactly:
 * columns = weeks (left to right), rows = days (Sun-Sat top to bottom).
 */

const { escapeXml, darken } = require("./svg-pr");

/**
 * Green colors matching GitHub dark contribution graph.
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
 * Always dark background regardless of theme.
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

  if (!days || days.length === 0) {
    return generateNoDataSVG(username, colors, hideBorder);
  }

  const maxCount = Math.max(...days.map((d) => d.count), 1);

  // Build weeks array - each week is [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
  // This matches GitHub's layout: columns go left=right (weeks), rows go top=bottom (days)
  const weeks = [];
  let currentWeek = new Array(7).fill(null);

  for (const day of days) {
    const d = new Date(day.date + "T00:00:00");
    const dayOfWeek = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

    // If Sunday and week already has data, start new week
    if (dayOfWeek === 0 && currentWeek.some((c) => c !== null)) {
      weeks.push(currentWeek);
      currentWeek = new Array(7).fill(null);
    }

    currentWeek[dayOfWeek] = day;

    // If Saturday, push completed week
    if (dayOfWeek === 6) {
      weeks.push(currentWeek);
      currentWeek = new Array(7).fill(null);
    }
  }

  // Push any remaining partial week
  if (currentWeek.some((c) => c !== null)) {
    weeks.push(currentWeek);
  }

  const cellSize = 12;
  const cellGap = 3;
  const cellStep = cellSize + cellGap;
  const padX = 30;
  const padY = 20;
  const labelWidth = 30;
  const headerHeight = 46;
  const gridWidth = weeks.length * cellStep;
  const gridHeight = 7 * cellStep;
  const cardWidth = Math.max(gridWidth + padX * 2 + labelWidth, 620);
  const cardHeight = headerHeight + gridHeight + padY + 30;

  const hideBorderAttr = hideBorder ? `rx="6"` : `rx="6" stroke="#30363d" stroke-width="1"`;

  const displayTitle = title || `${username}'s Contributions`;

  let cells = "";

  // Render cells: weekIdx = column (x), dayOfWeek = row (y)
  weeks.forEach((week, weekIdx) => {
    week.forEach((day, dayOfWeek) => {
      if (!day) return;
      const x = padX + labelWidth + weekIdx * cellStep;
      const y = headerHeight + padY + dayOfWeek * cellStep;
      const color = getContributionColor(day.count, maxCount);

      cells += `
      <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="#${color}">
        <title>${day.date}: ${day.count} contribution${day.count !== 1 ? "s" : ""}</title>
      </rect>`;

      // Show number inside cell
      if (day.count > 0) {
        const fontSize = day.count > 99 ? 6 : day.count > 9 ? 7 : 8;
        const textColor = day.count / maxCount > 0.5 ? "0d1117" : "e6edf3";
        cells += `
      <text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 2.5}" text-anchor="middle" font-family="monospace" font-size="${fontSize}" font-weight="700" fill="#${textColor}" pointer-events="none">${day.count}</text>`;
      }
    });
  });

  // Day of week labels on left side (matching GitHub: Sun, Mon, Wed, Fri)
  const dayLabels = ["Sun", "", "Tue", "", "Thu", "", "Sat"];
  let labels = "";
  dayLabels.forEach((label, idx) => {
    if (!label) return;
    const y = headerHeight + padY + idx * cellStep + cellSize / 2 + 3;
    labels += `<text x="${padX}" y="${y}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="9" fill="#8b949e" text-anchor="end">${label}</text>`;
  });

  // Month labels above grid
  let monthLabels = "";
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let lastMonth = -1;
  weeks.forEach((week, weekIdx) => {
    // Find first non-null day in this week
    const firstDay = week.find((d) => d !== null);
    if (firstDay) {
      const month = new Date(firstDay.date + "T00:00:00").getMonth();
      if (month !== lastMonth) {
        const x = padX + labelWidth + weekIdx * cellStep;
        monthLabels += `<text x="${x}" y="${headerHeight + padY - 6}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="9" fill="#8b949e">${monthNames[month]}</text>`;
        lastMonth = month;
      }
    }
  });

  // Legend at bottom right
  const legendX = cardWidth - padX - 160;
  const legendY = headerHeight + padY + gridHeight + 16;
  const legendColors = ["161b22", "0e4429", "006d32", "26a641", "39d353"];
  let legend = `<text x="${legendX}" y="${legendY}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="9" fill="#8b949e">Less</text>`;
  legendColors.forEach((color, idx) => {
    const lx = legendX + 28 + idx * (cellSize + 2);
    legend += `<rect x="${lx}" y="${legendY - 9}" width="${cellSize - 1}" height="${cellSize - 1}" rx="2" fill="#${color}"/>`;
  });
  legend += `<text x="${legendX + 28 + 5 * (cellSize + 2) + 4}" y="${legendY}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="9" fill="#8b949e">More</text>`;

  // Always dark background: #0d1117
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>
    .title { font: 600 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
    .badge-text { font: 500 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
  </style>
  <!-- Dark background -->
  <rect x="0" y="0" width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hideBorderAttr}/>
  <!-- Subtle border on top -->
  <rect x="0" y="0" width="${cardWidth}" height="3" fill="#39d353" opacity="0.3" rx="6"/>
  <!-- Title -->
  <text x="${padX}" y="26" class="title" fill="#e6edf3">${escapeXml(displayTitle)}</text>
  <!-- Total badge -->
  <rect x="${cardWidth - padX - 170}" y="12" width="170" height="22" rx="11" fill="#39d353" opacity="0.12"/>
  <text x="${cardWidth - padX - 85}" y="26" text-anchor="middle" class="badge-text" fill="#39d353">${totalContributions} contributions in the last year</text>
  <!-- Separator -->
  <line x1="${padX}" y1="${headerHeight - 4}" x2="${cardWidth - padX}" y2="${headerHeight - 4}" stroke="#30363d" stroke-width="0.5"/>
  <!-- Month labels -->
  ${monthLabels}
  <!-- Day labels -->
  ${labels}
  <!-- Contribution cells -->
  ${cells}
  <!-- Legend -->
  ${legend}
</svg>`;
}

/**
 * Compact contribution summary card. Always dark.
 */
function generateContributionSummarySVG(options) {
  const { username, totalContributions, currentStreak, longestStreak, colors, hideBorder } = options;

  const cardWidth = 420;
  const cardHeight = 165;
  const pad = 28;

  const hideBorderAttr = hideBorder ? `rx="6"` : `rx="6" stroke="#30363d" stroke-width="1"`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>
    .title { font: 600 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
    .stat-num { font: 700 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
    .stat-label { font: 400 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
  </style>
  <!-- Dark background -->
  <rect x="0" y="0" width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hideBorderAttr}/>
  <!-- Green top accent -->
  <rect x="0" y="0" width="${cardWidth}" height="3" fill="#39d353" opacity="0.3" rx="6"/>
  <!-- Header -->
  <circle cx="${pad + 6}" cy="26" r="6" fill="#39d353"/>
  <text x="${pad + 20}" y="30" class="title" fill="#e6edf3">${escapeXml(username)}'s Contributions</text>
  <line x1="${pad}" y1="48" x2="${cardWidth - pad}" y2="48" stroke="#30363d" stroke-width="0.5"/>

  <!-- Total -->
  <g transform="translate(${pad}, 60)">
    <rect x="0" y="0" width="100" height="72" rx="8" fill="#39d353" opacity="0.08"/>
    <text x="50" y="36" text-anchor="middle" class="stat-num" fill="#39d353">${totalContributions}</text>
    <text x="50" y="54" text-anchor="middle" class="stat-label" fill="#8b949e">Total</text>
  </g>

  <!-- Current Streak -->
  <g transform="translate(${pad + 115}, 60)">
    <rect x="0" y="0" width="100" height="72" rx="8" fill="#58a6ff" opacity="0.08"/>
    <text x="50" y="36" text-anchor="middle" class="stat-num" fill="#58a6ff">${currentStreak}</text>
    <text x="50" y="54" text-anchor="middle" class="stat-label" fill="#8b949e">Current Streak</text>
  </g>

  <!-- Longest Streak -->
  <g transform="translate(${pad + 230}, 60)">
    <rect x="0" y="0" width="100" height="72" rx="8" fill="#e6edf3" opacity="0.05"/>
    <text x="50" y="36" text-anchor="middle" class="stat-num" fill="#e6edf3">${longestStreak}</text>
    <text x="50" y="54" text-anchor="middle" class="stat-label" fill="#8b949e">Longest Streak</text>
  </g>
</svg>`;
}

/**
 * No data SVG. Always dark.
 */
function generateNoDataSVG(username, colors, hideBorder) {
  const cardWidth = 400;
  const cardHeight = 120;
  const hideBorderAttr = hideBorder ? `rx="6"` : `rx="6" stroke="#30363d" stroke-width="1"`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <rect x="0" y="0" width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hideBorderAttr}/>
  <text x="${cardWidth / 2}" y="50" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" fill="#e6edf3">${escapeXml(username)}'s Contributions</text>
  <text x="${cardWidth / 2}" y="75" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="12" fill="#8b949e" opacity="0.6">No contribution data found</text>
</svg>`;
}

module.exports = {
  generateContributionSVG,
  generateContributionSummarySVG,
  getContributionColor,
};
