/**
 * Master Card SVG generation - all cards merged into one dashboard SVG.
 */

function getContributionColorByLevel(level) {
  const levelColors = ["161b22", "0e4429", "006d32", "26a641", "39d353"];
  return levelColors[Math.max(0, Math.min(4, Number(level) || 0))];
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
    colors,
    hideBorder,
    cardWidth = 1000,
  } = options;

  const pad = 24;
  const contentW = Math.max(820, cardWidth - pad * 2);
  const cardHeight = 640;
  const hba = hideBorder ? `rx="10"` : `rx="10" stroke="#30363d" stroke-width="1"`;

  const accentColor = (colors && colors.accent_color) || "58a6ff";
  const titleColor = (colors && colors.title_color) || "e6edf3";
  const textColor = (colors && colors.text_color) || "c9d1d9";

  const stats = [
    { label: "Visitors", value: visitors, fill: accentColor, opacity: ".10" },
    { label: "Total PRs", value: totalPRs, fill: accentColor, opacity: ".08" },
    { label: "Open PRs", value: openPRs, fill: "f85149", opacity: ".12" },
    { label: "Repos", value: repoCount, fill: "1f6feb", opacity: ".10" },
    { label: "Contributions", value: contributions, fill: "39d353", opacity: ".10" },
  ];

  const statGap = 12;
  const statW = Math.floor((contentW - statGap * (stats.length - 1)) / stats.length);
  const statH = 84;
  let statCards = "";
  stats.forEach((s, i) => {
    const x = pad + i * (statW + statGap);
    statCards += `<g transform="translate(${x},76)">
      <rect width="${statW}" height="${statH}" rx="10" fill="#${s.fill}" opacity="${s.opacity}"/>
      <text x="${statW / 2}" y="36" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="23" font-weight="700" fill="#${s.fill}">${s.value}</text>
      <text x="${statW / 2}" y="60" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#8b949e">${s.label}</text>
    </g>`;
  });

  const topRepos = repoList.slice(0, 5);
  const maxRepoCount = Math.max(1, ...topRepos.map((r) => r.count || 0));
  let repoRows = "";
  topRepos.forEach((repo, i) => {
    const y = 228 + i * 30;
    const name = String(repo.name || "unknown");
    const shortName = name.length > 28 ? `${name.slice(0, 25)}...` : name;
    const pct = (repo.count || 0) / maxRepoCount;
    const barW = Math.round(230 * pct);
    repoRows += `<g transform="translate(${pad + 14},${y})">
      <text x="0" y="14" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#${textColor}">${escapeXml(shortName)}</text>
      <rect x="245" y="6" width="230" height="9" rx="4" fill="#30363d"/>
      <rect x="245" y="6" width="${barW}" height="9" rx="4" fill="#${accentColor}"/>
      <text x="485" y="14" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" font-weight="600" fill="#${accentColor}">${repo.count || 0}</text>
    </g>`;
  });

  const topLangs = languages.slice(0, 6);
  let langRows = "";
  topLangs.forEach((lang, i) => {
    const y = 228 + i * 26;
    const langName = String(lang.name || "Unknown");
    const langPct = Number(lang.percentage || 0);
    const barW = Math.round(180 * Math.max(0, Math.min(100, langPct)) / 100);
    langRows += `<g transform="translate(${pad + 558},${y})">
      <text x="0" y="13" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#${textColor}">${escapeXml(langName)}</text>
      <rect x="120" y="5" width="180" height="8" rx="4" fill="#30363d"/>
      <rect x="120" y="5" width="${barW}" height="8" rx="4" fill="#${accentColor}"/>
      <text x="308" y="13" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">${langPct.toFixed(1)}%</text>
    </g>`;
  });

  const sortedDays = [...contributionDays].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const recent = sortedDays.slice(-126);
  const cell = 9;
  const gap = 3;
  const step = cell + gap;
  const heatmapX = pad + 14;
  const heatmapY = 434;
  let heatmapCells = "";
  recent.forEach((d, idx) => {
    const col = Math.floor(idx / 7);
    const row = idx % 7;
    const x = heatmapX + col * step;
    const y = heatmapY + row * step;
    const fill = getContributionColorByLevel(d.level);
    const count = Number(d.count || 0);
    const date = escapeXml(String(d.date || ""));
    heatmapCells += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" fill="#${fill}"><title>${date}: ${count}</title></rect>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <defs>
    <linearGradient id="masterHeader" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#${accentColor};stop-opacity:0.16"/>
      <stop offset="100%" style="stop-color:#${accentColor};stop-opacity:0"/>
    </linearGradient>
  </defs>

  <rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
  <rect width="${cardWidth}" height="4" fill="#${accentColor}" rx="10"/>
  <rect x="1" y="4" width="${cardWidth - 2}" height="56" fill="url(#masterHeader)"/>

  <text x="${pad}" y="31" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="20" font-weight="700" fill="#${titleColor}">${escapeXml(username)} · Master Card</text>
  <text x="${pad}" y="50" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" fill="#8b949e">All-in-one stats: visitors, PRs, repositories, languages, and contribution graph</text>

  ${statCards}

  <line x1="${pad}" y1="180" x2="${cardWidth - pad}" y2="180" stroke="#30363d" stroke-width="1"/>
  <text x="${pad + 14}" y="210" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="13" font-weight="600" fill="#${titleColor}">Top Repositories</text>
  <text x="${pad + 558}" y="210" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="13" font-weight="600" fill="#${titleColor}">Top Languages</text>
  ${repoRows}
  ${langRows}

  <line x1="${pad}" y1="406" x2="${cardWidth - pad}" y2="406" stroke="#30363d" stroke-width="1"/>
  <text x="${pad + 14}" y="426" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="13" font-weight="600" fill="#${titleColor}">Contribution Heatmap (last ${recent.length} days)</text>

  ${heatmapCells}

  <g transform="translate(${pad + 14},542)">
    <text x="0" y="10" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">Less</text>
    <rect x="30" y="2" width="9" height="9" rx="2" fill="#161b22"/>
    <rect x="42" y="2" width="9" height="9" rx="2" fill="#0e4429"/>
    <rect x="54" y="2" width="9" height="9" rx="2" fill="#006d32"/>
    <rect x="66" y="2" width="9" height="9" rx="2" fill="#26a641"/>
    <rect x="78" y="2" width="9" height="9" rx="2" fill="#39d353"/>
    <text x="94" y="10" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">More</text>
  </g>

  <line x1="${pad}" y1="${cardHeight - 18}" x2="${cardWidth - pad}" y2="${cardHeight - 18}" stroke="#30363d" stroke-width=".7"/>
  <text x="${cardWidth - pad}" y="${cardHeight - 6}" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">Generated by Gitly</text>
</svg>`;
}

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

module.exports = { generateMasterCardSVG, escapeXml };
