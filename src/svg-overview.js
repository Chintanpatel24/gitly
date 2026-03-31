/**
 * Overview Card SVG generation
 * Shows stats: Total Stars, 2026 Commits, Total PRs, Total Issues, Contributed to.
 */

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function generateOverviewSVG(options) {
  const {
    totalStars = 0,
    totalCommits = 0,
    totalPRs = 0,
    totalIssues = 0,
    contributedTo = 0,
    colors,
    hideBorder,
  } = options;

  const W = 460, H = 260, P = 24;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;

  const accentColor = (colors && colors.accent_color) || "58a6ff";

  const stats = [
    { label: "Total Stars", value: totalStars, color: "eab308" },
    { label: "2026 Commits", value: totalCommits, color: "39d353" },
    { label: "Total PRs", value: totalPRs, color: accentColor },
    { label: "Total Issues", value: totalIssues, color: "f85149" },
    { label: "Contributed to", value: contributedTo, color: "8b5cf6" },
  ];

  const rowH = 36;
  const startY = 56;

  let rows = "";
  stats.forEach((s, i) => {
    const y = startY + i * rowH;
    const val = typeof s.value === "number" ? s.value.toLocaleString() : s.value;
    rows += `<g transform="translate(0,${y})">
      <rect width="${W}" height="${rowH}" fill="#e6edf3" opacity="${i % 2 === 0 ? ".02" : "0"}"/>
      <text x="${P}" y="23" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="13" fill="#c9d1d9">${s.label}</text>
      <circle cx="${W - P - 6}" cy="18" r="4" fill="#${s.color}" opacity=".3"/>
      <text x="${W - P - 18}" y="23" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="16" font-weight="700" fill="#${s.color}">${val}</text>
    </g>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#0d1117" ${hba}/>
  <rect width="${W}" height="3" fill="#${accentColor}" rx="8"/>
  <circle cx="${P + 6}" cy="22" r="5" fill="#${accentColor}" opacity=".2"/><circle cx="${P + 6}" cy="22" r="2.5" fill="#${accentColor}"/>
  <text x="${P + 16}" y="26" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="14" font-weight="600" fill="#e6edf3">Overview</text>
  <line x1="${P}" y1="42" x2="${W - P}" y2="42" stroke="#30363d" stroke-width=".5"/>
  ${rows}
</svg>`;
}

module.exports = { generateOverviewSVG };
