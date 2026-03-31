/**
 * Master Card SVG generation - all cards merged into one dashboard SVG.
 * Enhanced design with streaks, trend line, and polished visuals.
 */

function getContributionColorByLevel(level) {
  const levelColors = ["161b22", "0e4429", "006d32", "26a641", "39d353"];
  return levelColors[Math.max(0, Math.min(4, Number(level) || 0))];
}

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function generateMasterCardSVG(options) {
  const {
    username,
    totalPRs = 0,
    openPRs = 0,
    repoCount = 0,
    languages = [],
    contributions = 0,
    repoList = [],
    visitors = 0,
    contributionDays = [],
    currentStreak = 0,
    longestStreak = 0,
    colors,
    hideBorder,
    cardWidth = 1000,
  } = options;

  const pad = 24;
  const contentW = Math.max(820, cardWidth - pad * 2);
  const cardHeight = 700;
  const hba = hideBorder ? `rx="10"` : `rx="10" stroke="#30363d" stroke-width="1"`;

  const accentColor = (colors && colors.accent_color) || "58a6ff";
  const titleColor = (colors && colors.title_color) || "e6edf3";
  const textColor = (colors && colors.text_color) || "c9d1d9";

  // --- HEADER ---
  const headerY = 0;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <defs>
    <linearGradient id="mHdr" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#${accentColor};stop-opacity:0.18"/>
      <stop offset="100%" style="stop-color:#${accentColor};stop-opacity:0"/>
    </linearGradient>
    <linearGradient id="mHeatG" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#39d353;stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:#39d353;stop-opacity:0"/>
    </linearGradient>
  </defs>

  <rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
  <rect width="${cardWidth}" height="4" fill="#${accentColor}" rx="10"/>
  <rect x="1" y="4" width="${cardWidth - 2}" height="52" fill="url(#mHdr)"/>

  <!-- Title bar -->
  <g transform="translate(${pad},16)">
    <text x="0" y="22" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="20" font-weight="700" fill="#${titleColor}">${escapeXml(username)}</text>
    <text x="0" y="38" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#8b949e">Dashboard</text>
  </g>

  <!-- Badge: total contributions -->
  <g transform="translate(${cardWidth - pad - 180},18)">
    <rect width="180" height="32" rx="16" fill="#39d353" opacity=".12"/>
    <text x="90" y="21" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="600" fill="#39d353">${contributions.toLocaleString()} contributions</text>
  </g>
`;

  // --- STAT CARDS (6 stats in a row) ---
  const stats = [
    { label: "Visitors", value: visitors, color: accentColor },
    { label: "Total PRs", value: totalPRs, color: accentColor },
    { label: "Open PRs", value: openPRs, color: "f85149" },
    { label: "Repos", value: repoCount, color: "1f6feb" },
    { label: "Cur. Streak", value: currentStreak + "d", color: "f97316" },
    { label: "Best Streak", value: longestStreak + "d", color: "eab308" },
  ];

  const statGap = 10;
  const statCount = stats.length;
  const statW = Math.floor((contentW - statGap * (statCount - 1)) / statCount);
  const statH = 78;

  stats.forEach((s, i) => {
    const x = pad + i * (statW + statGap);
    svg += `<g transform="translate(${x},72)">
      <rect width="${statW}" height="${statH}" rx="10" fill="#${s.color}" opacity=".08"/>
      <rect width="${statW}" height="${statH}" rx="10" fill="none" stroke="#${s.color}" stroke-opacity=".15" stroke-width="1"/>
      <text x="${statW / 2}" y="38" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="24" font-weight="700" fill="#${s.color}">${s.value}</text>
      <text x="${statW / 2}" y="62" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">${s.label}</text>
    </g>`;
  });

  // --- DIVIDER ---
  const divY = 162;
  svg += `<line x1="${pad}" y1="${divY}" x2="${cardWidth - pad}" y2="${divY}" stroke="#30363d" stroke-width="1"/>`;

  // --- TOP REPOS (left) + TOP LANGS (right) ---
  const section2Y = divY + 16;
  svg += `<text x="${pad + 8}" y="${section2Y + 10}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="600" fill="#${titleColor}">Top Repositories</text>`;
  svg += `<text x="${pad + 498}" y="${section2Y + 10}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="600" fill="#${titleColor}">Top Languages</text>`;

  const topRepos = repoList.slice(0, 5);
  const maxRepoCount = Math.max(1, ...topRepos.map(r => r.count || 0));

  topRepos.forEach((repo, i) => {
    const y = section2Y + 18 + i * 28;
    const name = String(repo.name || "unknown");
    const shortName = name.length > 24 ? `${name.slice(0, 21)}...` : name;
    const pct = (repo.count || 0) / maxRepoCount;
    const barW = Math.round(200 * pct);
    svg += `<g transform="translate(${pad + 8},${y})">
      <text x="0" y="14" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#${textColor}">${escapeXml(shortName)}</text>
      <rect x="180" y="2" width="200" height="12" rx="6" fill="#30363d"/>
      <rect x="180" y="2" width="${barW}" height="12" rx="6" fill="#${accentColor}"/>
      <text x="390" y="14" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="700" fill="#${accentColor}">${repo.count || 0}</text>
    </g>`;
  });

  // Languages
  const { getLanguageColor } = require("./languages");
  const topLangs = languages.slice(0, 5);
  topLangs.forEach((lang, i) => {
    const y = section2Y + 18 + i * 28;
    const langName = String(lang.name || "Unknown");
    const langPct = Number(lang.percentage || 0);
    const barW = Math.round(170 * Math.max(0, Math.min(100, langPct)) / 100);
    const langColor = getLanguageColor(langName);
    svg += `<g transform="translate(${pad + 498},${y})">
      <circle cx="6" cy="10" r="5" fill="#${langColor}"/>
      <text x="18" y="14" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#${textColor}">${escapeXml(langName)}</text>
      <rect x="120" y="2" width="170" height="12" rx="6" fill="#30363d"/>
      <rect x="120" y="2" width="${barW}" height="12" rx="6" fill="#${langColor}"/>
      <text x="300" y="14" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="700" fill="#${langColor}">${langPct.toFixed(1)}%</text>
    </g>`;
  });

  // --- DIVIDER ---
  const div2Y = section2Y + 18 + 5 * 28 + 8;
  svg += `<line x1="${pad}" y1="${div2Y}" x2="${cardWidth - pad}" y2="${div2Y}" stroke="#30363d" stroke-width="1"/>`;

  // --- 30 DAY TREND LINE (left) + HEATMAP (right) ---
  const sortedDays = [...contributionDays].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const recent = sortedDays.slice(-126);
  const last30 = sortedDays.slice(-30);

  // Trend line section
  const trendSectionY = div2Y + 16;
  svg += `<text x="${pad + 8}" y="${trendSectionY + 10}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="600" fill="#${titleColor}">30-Day Trend</text>`;

  const trendX = pad + 8;
  const trendY = trendSectionY + 20;
  const trendW = 380;
  const trendH = 50;
  const max30 = Math.max(...last30.map(d => d.count), 1);
  const stepX = last30.length > 1 ? trendW / (last30.length - 1) : 0;

  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const gy = trendY + trendH - (i / 4) * trendH;
    svg += `<line x1="${trendX}" y1="${gy}" x2="${trendX + trendW}" y2="${gy}" stroke="#30363d" stroke-width=".3"/>`;
  }

  // Area fill
  let areaPath = `M${trendX},${trendY + trendH} `;
  last30.forEach((d, i) => {
    const x = trendX + i * stepX;
    const y = trendY + trendH - (d.count / max30) * trendH;
    areaPath += `L${x},${y} `;
  });
  areaPath += `L${trendX + (last30.length - 1) * stepX},${trendY + trendH} Z`;
  svg += `<path d="${areaPath}" fill="#${accentColor}" opacity=".08"/>`;

  // Line
  let trendPath = "";
  let trendDots = "";
  last30.forEach((d, i) => {
    const x = trendX + i * stepX;
    const y = trendY + trendH - (d.count / max30) * trendH;
    trendPath += `${i === 0 ? "M" : "L"}${x},${y} `;
    if (i === last30.length - 1 || d.count === max30) {
      trendDots += `<circle cx="${x}" cy="${y}" r="3" fill="#${accentColor}"><title>${d.date}: ${d.count}</title></circle>`;
    }
  });
  svg += `<path d="${trendPath.trim()}" fill="none" stroke="#${accentColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  svg += trendDots;

  // Avg label
  const avg30 = last30.length > 0 ? (last30.reduce((s, d) => s + d.count, 0) / last30.length).toFixed(1) : "0";
  svg += `<text x="${trendX}" y="${trendY + trendH + 14}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">Avg: ${avg30}/day</text>`;

  // Heatmap section
  const heatmapLabelX = pad + 420;
  svg += `<text x="${heatmapLabelX}" y="${trendSectionY + 10}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="600" fill="#${titleColor}">Activity Heatmap (${recent.length}d)</text>`;

  const cell = 8;
  const cellGap = 3;
  const cellStep = cell + cellGap;
  const heatmapX = heatmapLabelX;
  const heatmapY = trendSectionY + 18;

  // Month labels for heatmap
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let prevMonth = -1;
  let heatmapCells = "";
  recent.forEach((d, idx) => {
    const col = Math.floor(idx / 7);
    const row = idx % 7;
    const x = heatmapX + col * cellStep;
    const y = heatmapY + row * cellStep;
    const fill = getContributionColorByLevel(d.level);
    const count = Number(d.count || 0);
    const date = escapeXml(String(d.date || ""));

    // Month label
    const dt = new Date(`${d.date}T00:00:00`);
    const month = dt.getMonth();
    if (row === 0 && month !== prevMonth) {
      svg += `<text x="${x}" y="${heatmapY - 4}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="8" fill="#8b949e">${monthNames[month]}</text>`;
      prevMonth = month;
    }

    heatmapCells += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" fill="#${fill}"><title>${date}: ${count}</title></rect>`;
  });
  svg += heatmapCells;

  // Legend
  const legY = heatmapY + 7 * cellStep + 12;
  svg += `<g transform="translate(${heatmapX},${legY})">
    <text x="0" y="9" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" fill="#8b949e">Less</text>
    <rect x="28" y="1" width="8" height="8" rx="2" fill="#161b22"/>
    <rect x="39" y="1" width="8" height="8" rx="2" fill="#0e4429"/>
    <rect x="50" y="1" width="8" height="8" rx="2" fill="#006d32"/>
    <rect x="61" y="1" width="8" height="8" rx="2" fill="#26a641"/>
    <rect x="72" y="1" width="8" height="8" rx="2" fill="#39d353"/>
    <text x="86" y="9" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" fill="#8b949e">More</text>
  </g>`;

  // --- FOOTER ---
  svg += `<line x1="${pad}" y1="${cardHeight - 18}" x2="${cardWidth - pad}" y2="${cardHeight - 18}" stroke="#30363d" stroke-width=".7"/>`;
  svg += `<text x="${cardWidth - pad}" y="${cardHeight - 6}" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">Generated by Gitly</text>`;
  svg += `</svg>`;

  return svg;
}

module.exports = { generateMasterCardSVG, escapeXml };
