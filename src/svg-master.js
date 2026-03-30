/**
 * Master Card SVG generation - combines all stats into one card
 */

function generateMasterCardSVG(options) {
  const {
    username,
    totalPRs = 0,
    openPRs = 0,
    repoCount = 0,
    languages = [],
    contributions = 0,
    colors,
    hideBorder,
    cardWidth = 900,
  } = options;

  const P = 24;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;
  const accentColor = (colors && colors.accent_color) || "58a6ff";
  const titleColor = (colors && colors.title_color) || "58a6ff";
  
  // Card dimensions
  const headerH = 60;
  const statsH = 100;
  const langH = 140;
  const totalH = headerH + statsH + langH + 40;

  // Language bars (top 5)
  const topLangs = languages.slice(0, 5);
  let langRows = "";
  topLangs.forEach((lang, i) => {
    const y = headerH + statsH + 20 + i * 22;
    const pct = Math.min((lang.percentage / 100) * 400, 400);
    langRows += `<g transform="translate(${P},${y})">
      <text x="0" y="14" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#c9d1d9">${escapeXml(lang.name)}</text>
      <rect x="120" y="6" width="400" height="8" rx="4" fill="#30363d"/>
      <rect x="120" y="6" width="${pct}" height="8" rx="4" fill="#${accentColor}"/>
      <text x="530" y="14" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">${lang.percentage}%</text>
    </g>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${totalH}" viewBox="0 0 ${cardWidth} ${totalH}">
  <style>
    .header{font:600 16px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
    .stat-label{font:400 11px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
    .stat-value{font:700 20px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
    .lang-label{font:500 12px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
  </style>
  
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#${accentColor};stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:#${accentColor};stop-opacity:0" />
    </linearGradient>
  </defs>

  <!-- Main card background -->
  <rect width="${cardWidth}" height="${totalH}" fill="#0d1117" ${hba}/>
  <rect width="${cardWidth}" height="3" fill="#${accentColor}" rx="8"/>
  
  <!-- Header -->
  <rect width="${cardWidth}" height="${headerH}" fill="url(#headerGrad)"/>
  <text x="${P}" y="40" class="header" fill="#${titleColor}">${escapeXml(username)}'s GitHub Master Stats</text>
  
  <!-- Stats Grid -->
  <g transform="translate(${P},${headerH})">
    <!-- Total PRs -->
    <rect width="130" height="80" rx="6" fill="#${accentColor}" opacity=".08"/>
    <text x="65" y="30" text-anchor="middle" class="stat-value" fill="#${accentColor}">${totalPRs}</text>
    <text x="65" y="55" text-anchor="middle" class="stat-label" fill="#8b949e">Total PRs</text>
    
    <!-- Open PRs -->
    <g transform="translate(150,0)">
      <rect width="130" height="80" rx="6" fill="#${accentColor}" opacity=".06"/>
      <text x="65" y="30" text-anchor="middle" class="stat-value" fill="#${accentColor}">${openPRs}</text>
      <text x="65" y="55" text-anchor="middle" class="stat-label" fill="#8b949e">Open PRs</text>
    </g>
    
    <!-- Repositories -->
    <g transform="translate(300,0)">
      <rect width="130" height="80" rx="6" fill="#e6edf3" opacity=".08"/>
      <text x="65" y="30" text-anchor="middle" class="stat-value" fill="#e6edf3">${repoCount}</text>
      <text x="65" y="55" text-anchor="middle" class="stat-label" fill="#8b949e">Repositories</text>
    </g>
    
    <!-- Contributions -->
    <g transform="translate(450,0)">
      <rect width="130" height="80" rx="6" fill="#3fb950" opacity=".08"/>
      <text x="65" y="30" text-anchor="middle" class="stat-value" fill="#3fb950">${contributions}</text>
      <text x="65" y="55" text-anchor="middle" class="stat-label" fill="#8b949e">Contributions</text>
    </g>
  </g>
  
  <!-- Language Section Header -->
  <text x="${P}" y="${headerH + statsH + 10}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="600" fill="#${titleColor}">Top Languages</text>
  
  <!-- Languages -->
  ${langRows}
  
  <!-- Footer divider -->
  <line x1="${P}" y1="${totalH - 2}" x2="${cardWidth - P}" y2="${totalH - 2}" stroke="#30363d" stroke-width=".5"/>
</svg>`;
}

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

module.exports = { generateMasterCardSVG, escapeXml };
