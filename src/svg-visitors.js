/**
 * Visitors Counter SVG generation
 */

function generateVisitorsSVG(options) {
  const {
    username,
    count = 0,
    colors,
    hideBorder,
    cardWidth = 400,
  } = options;

  const cardHeight = 120;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;
  const P = 24;
  const accentColor = (colors && colors.accent_color) || "58a6ff";
  const titleColor = (colors && colors.title_color) || "58a6ff";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>
    .header{font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
    .count{font:700 42px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
    .label{font:400 12px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
  </style>
  
  <defs>
    <linearGradient id="visitorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#${accentColor};stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:#${accentColor};stop-opacity:0" />
    </linearGradient>
  </defs>

  <!-- Main card -->
  <rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
  <rect width="${cardWidth}" height="3" fill="#${accentColor}" rx="8"/>
  
  <!-- Header gradient -->
  <rect y="3" width="${cardWidth}" height="50" fill="url(#visitorGrad)"/>
  
  <!-- Eye icon + Header -->
  <g transform="translate(${P},12)">
    <circle cx="8" cy="8" r="6" fill="none" stroke="#${accentColor}" stroke-width="1.5"/>
    <circle cx="8" cy="8" r="3" fill="#${accentColor}"/>
    <text x="24" y="16" class="header" fill="#${titleColor}">Profile Views</text>
  </g>
  
  <!-- Visitor count -->
  <text x="${cardWidth / 2}" y="80" text-anchor="middle" class="count" fill="#${accentColor}">${count.toLocaleString()}</text>
  
  <!-- Divider -->
  <line x1="${P}" y1="${cardHeight - 20}" x2="${cardWidth - P}" y2="${cardHeight - 20}" stroke="#30363d" stroke-width=".5"/>
  
  <!-- Footer text -->
  <text x="${cardWidth / 2}" y="${cardHeight - 6}" text-anchor="middle" class="label" fill="#8b949e">Visitors to @${escapeXml(username)}'s profile</text>
</svg>`;
}

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

module.exports = { generateVisitorsSVG, escapeXml };
