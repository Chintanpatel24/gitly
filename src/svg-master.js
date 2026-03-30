/**
 * Master Card SVG generation - comprehensive dashboard combining all stats
 */

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
    colors,
    hideBorder,
    cardWidth = 1000,
  } = options;

  const P = 28;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;
  const accentColor = (colors && colors.accent_color) || "58a6ff";
  const titleColor = (colors && colors.title_color) || "58a6ff";

  // Build top repos section (top 4)
  const topRepos = repoList.slice(0, 4);
  let repoRows = "";
  topRepos.forEach((repo, i) => {
    const y = 340 + i * 32;
    const repoName = repo.name.length > 30 ? repo.name.substring(0, 27) + "..." : repo.name;
    const pct = Math.min((repo.count / repoList[0]?.count || 1) * 200, 200);
    repoRows += `<g transform="translate(${P},${y})">
      <text x="0" y="16" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" fill="#c9d1d9">${escapeXml(repoName)}</text>
      <rect x="260" y="6" width="200" height="10" rx="5" fill="#30363d" opacity=".5"/>
      <rect x="260" y="6" width="${pct}" height="10" rx="5" fill="#${accentColor}"/>
      <text x="470" y="16" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" font-weight="600" fill="#${accentColor}">${repo.count}</text>
    </g>`;
  });

  // Build languages section (top 6)
  const topLangs = languages.slice(0, 6);
  let langRows = "";
  let langY = 560;
  topLangs.forEach((lang, i) => {
    if (i === 3) langY = 560;
    const y = (i < 3 ? 560 : 560) + (i % 3) * 28;
    const langX = (i < 3 ? P : P + 340);
    const pct = Math.min((lang.percentage / 100) * 140, 140);
    langRows += `<g transform="translate(${langX},${y})">
      <text x="0" y="12" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">${escapeXml(lang.name)}</text>
      <rect x="0" y="16" width="140" height="6" rx="3" fill="#30363d" opacity=".4"/>
      <rect x="0" y="16" width="${pct}" height="6" rx="3" fill="#${accentColor}"/>
      <text x="155" y="19" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" fill="#8b949e">${lang.percentage}%</text>
    </g>`;
  });

  // Calculate card height dynamically
  const cardHeight = 700;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <defs>
    <linearGradient id="masterHeaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#${accentColor};stop-opacity:0.15" />
      <stop offset="100%" style="stop-color:#${accentColor};stop-opacity:0" />
    </linearGradient>
    <linearGradient id="statsBg1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#${accentColor};stop-opacity:0.08" />
      <stop offset="100%" style="stop-color:#${accentColor};stop-opacity:0.02" />
    </linearGradient>
  </defs>

  <!-- Main background -->
  <rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
  <rect width="${cardWidth}" height="4" fill="#${accentColor}" rx="8"/>

  <!-- Header Section -->
  <rect width="${cardWidth}" height="70" fill="url(#masterHeaderGrad)"/>
  <text x="${P}" y="28" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="20" font-weight="700" fill="#${titleColor}">${escapeXml(username)}</text>
  <text x="${P}" y="50" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="13" fill="#8b949e">GitHub Profile Statistics Dashboard</text>

  <!-- Top Stats Row -->
  <g transform="translate(${P},80)">
    <!-- Visitors -->
    <rect width="140" height="90" rx="8" fill="url(#statsBg1)"/>
    <circle cx="70" cy="20" r="5" fill="none" stroke="#${accentColor}" stroke-width="2"/>
    <circle cx="70" cy="20" r="3" fill="#${accentColor}"/>
    <text x="70" y="50" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="22" font-weight="700" fill="#${accentColor}">${visitors}</text>
    <text x="70" y="70" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#8b949e">Visitors</text>

    <!-- Total PRs -->
    <g transform="translate(160,0)">
      <rect width="140" height="90" rx="8" fill="#${accentColor}" opacity=".06"/>
      <text x="70" y="30" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="24" font-weight="700" fill="#${accentColor}">${totalPRs}</text>
      <text x="70" y="70" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#8b949e">Total PRs</text>
    </g>

    <!-- Open PRs -->
    <g transform="translate(320,0)">
      <rect width="140" height="90" rx="8" fill="#f85149" opacity=".1"/>
      <text x="70" y="30" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="24" font-weight="700" fill="#f85149">${openPRs}</text>
      <text x="70" y="70" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#8b949e">Open PRs</text>
    </g>

    <!-- Repositories -->
    <g transform="translate(480,0)">
      <rect width="140" height="90" rx="8" fill="#1f6feb" opacity=".1"/>
      <text x="70" y="30" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="24" font-weight="700" fill="#1f6feb">${repoCount}</text>
      <text x="70" y="70" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#8b949e">Repos</text>
    </g>

    <!-- Contributions -->
    <g transform="translate(640,0)">
      <rect width="140" height="90" rx="8" fill="#3fb950" opacity=".1"/>
      <text x="70" y="30" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="24" font-weight="700" fill="#3fb950">${contributions}</text>
      <text x="70" y="70" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#8b949e">Contributions</text>
    </g>
  </g>

  <!-- Divider -->
  <line x1="${P}" y1="190" x2="${cardWidth - P}" y2="190" stroke="#30363d" stroke-width="1" opacity=".5"/>

  <!-- Top Repositories Section -->
  <text x="${P}" y="225" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="13" font-weight="600" fill="#${titleColor}">Top Repositories</text>
  ${repoRows}

  <!-- Divider -->
  <line x1="${P}" y1="535" x2="${cardWidth - P}" y2="535" stroke="#30363d" stroke-width="1" opacity=".5"/>

  <!-- Languages Section -->
  <text x="${P}" y="560" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="13" font-weight="600" fill="#${titleColor}">Languages</text>
  ${langRows}

  <!-- Footer -->
  <line x1="${P}" y1="${cardHeight - 10}" x2="${cardWidth - P}" y2="${cardHeight - 10}" stroke="#30363d" stroke-width=".5" opacity=".5"/>
</svg>`;
}

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

module.exports = { generateMasterCardSVG, escapeXml };
