/**
 * Visitors Counter SVG generation
 */

function generateVisitorsSVG(options) {
  const {
    count = 0,
    colors,
    hideBorder,
    cardWidth = 460,
  } = options;

  const cardHeight = 120;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;
  const P = 24;
  const accentColor = (colors && colors.accent_color) || "58a6ff";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>
    .header{font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
    .count{font:700 52px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
  </style>

  <defs>
    <linearGradient id="visitorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#${accentColor};stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:#${accentColor};stop-opacity:0" />
    </linearGradient>
  </defs>

  <rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
  <rect width="${cardWidth}" height="3" fill="#${accentColor}" rx="8"/>
  <rect y="3" width="${cardWidth}" height="50" fill="url(#visitorGrad)"/>

  <g transform="translate(${P},12)">
    <circle cx="8" cy="8" r="6" fill="none" stroke="#${accentColor}" stroke-width="1.5"/>
    <circle cx="8" cy="8" r="3" fill="#${accentColor}"/>
    <text x="24" y="16" class="header" fill="#${accentColor}">Profile Views</text>
  </g>

  <text x="${cardWidth / 2}" y="88" text-anchor="middle" class="count" fill="#${accentColor}">${count.toLocaleString()}</text>
</svg>`;
}

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

module.exports = { generateVisitorsSVG, escapeXml };
