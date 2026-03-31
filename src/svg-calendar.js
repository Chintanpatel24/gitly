/**
 * Activity Calendar Card SVG
 * Year-at-a-glance contribution calendar showing all 12 months.
 */

const { escapeXml } = require("./svg-pr");

function getCalColor(count, maxCount) {
  if (count === 0) return "161b22";
  const ratio = count / maxCount;
  if (ratio <= 0.25) return "0e4429";
  if (ratio <= 0.5) return "006d32";
  if (ratio <= 0.75) return "26a641";
  return "39d353";
}

function generateCalendarSVG(options) {
  const { username, days, totalContributions = 0, colors, hideBorder, title } = options;

  if (!days || days.length === 0) {
    return noDataSVG(username, hideBorder);
  }

  const W = 460, P = 24;
  const hba = hideBorder ? `rx="10"` : `rx="10" stroke="#30363d" stroke-width="1"`;

  const accentColor = "39d353";
  const titleColor = (colors && colors.title_color) || "e6edf3";

  // Group days by month
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const months = {};
  const sortedDays = [...days].sort((a, b) => a.date.localeCompare(b.date));

  sortedDays.forEach(d => {
    const dt = new Date(`${d.date}T00:00:00`);
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
    if (!months[key]) {
      months[key] = { label: monthNames[dt.getMonth()], year: dt.getFullYear(), days: [], total: 0 };
    }
    months[key].days.push(d);
    months[key].total += d.count;
  });

  const monthKeys = Object.keys(months).slice(-12);
  const maxMonth = Math.max(...monthKeys.map(k => months[k].total), 1);
  const maxDay = Math.max(...sortedDays.map(d => d.count), 1);

  const headerH = 60;
  const monthBlockH = 32;
  const cellSize = 7;
  const cellGap = 2;
  const cellStep = cellSize + cellGap;
  const maxWeeks = 5;
  const monthBlockW = maxWeeks * cellStep + 50;
  const cols = 4;
  const rows = Math.ceil(monthKeys.length / cols);
  const H = headerH + rows * (monthBlockH + 8) + 40;

  const displayTitle = title || `${username}'s Activity Calendar`;

  // Header
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#0d1117" ${hba}/>
  <rect width="${W}" height="4" fill="#${accentColor}" rx="10"/>
  <g transform="translate(${P},16)">
    <rect width="32" height="32" rx="8" fill="#${accentColor}" opacity=".15"/>
    <text x="16" y="24" text-anchor="middle" font-size="18">&#x1F4C5;</text>
    <text x="42" y="22" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="14" font-weight="700" fill="#${titleColor}">${escapeXml(displayTitle)}</text>
    <text x="42" y="36" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">${totalContributions.toLocaleString()} contributions in the last year</text>
  </g>
`;

  // Month mini-calendars
  monthKeys.forEach((key, idx) => {
    const month = months[key];
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const baseX = P + col * (monthBlockW + 4);
    const baseY = headerH + row * (monthBlockH + 8);

    // Month label with total
    svg += `<text x="${baseX}" y="${baseY + 12}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" font-weight="600" fill="#e6edf3">${month.label}</text>`;
    svg += `<text x="${baseX + 28}" y="${baseY + 12}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" fill="#8b949e">${month.total}</text>`;

    // Mini cells
    month.days.forEach((d, dayIdx) => {
      const c = Math.floor(dayIdx / 7);
      const r = dayIdx % 7;
      const x = baseX + c * cellStep;
      const y = baseY + 16 + r * cellStep;
      const color = getCalColor(d.count, maxDay);
      svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="1.5" fill="#${color}"><title>${d.date}: ${d.count}</title></rect>`;
    });
  });

  // Legend
  const legY = H - 26;
  svg += `<g transform="translate(${P},${legY})">
    <text x="0" y="9" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" fill="#8b949e">Less</text>
    <rect x="28" y="1" width="7" height="7" rx="1.5" fill="#161b22"/>
    <rect x="38" y="1" width="7" height="7" rx="1.5" fill="#0e4429"/>
    <rect x="48" y="1" width="7" height="7" rx="1.5" fill="#006d32"/>
    <rect x="58" y="1" width="7" height="7" rx="1.5" fill="#26a641"/>
    <rect x="68" y="1" width="7" height="7" rx="1.5" fill="#39d353"/>
    <text x="82" y="9" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" fill="#8b949e">More</text>
  </g>`;

  svg += `</svg>`;
  return svg;
}

function noDataSVG(username, hideBorder) {
  const hba = hideBorder ? `rx="10"` : `rx="10" stroke="#30363d" stroke-width="1"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="120" viewBox="0 0 460 120">
    <rect width="460" height="120" fill="#0d1117" ${hba}/>
    <text x="230" y="55" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="14" fill="#e6edf3">${escapeXml(username)}'s Calendar</text>
    <text x="230" y="78" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="11" fill="#8b949e">No data found</text>
  </svg>`;
}

module.exports = { generateCalendarSVG };
