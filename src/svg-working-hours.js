/**
 * Working Hours Card SVG generation
 * Formula: TWt = Σ (Ti+1 - Ti) for all i where (Ti+1 - Ti) < 5 hours
 * Where TWt = Total Working Time, Ti = Timestamp of commit i
 */

function generateWorkingHoursSVG(options) {
  const {
    totalHours = 0,
    colors,
    hideBorder,
    cardWidth = 460,
  } = options;

  const cardHeight = 160;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;
  const P = 24;
  const accentColor = (colors && colors.accent_color) || "58a6ff";

  const formattedHours = Math.round(totalHours).toLocaleString();

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>
    .header{font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
    .hours{font:700 48px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
    .text-unit{font:500 12px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
    .stat{font:400 11px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
  </style>

  <rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
  <rect width="${cardWidth}" height="3" fill="#${accentColor}" rx="8"/>

  <g transform="translate(${P},12)">
    <circle cx="8" cy="8" r="6" fill="none" stroke="#${accentColor}" stroke-width="1.5"/>
    <circle cx="8" cy="8" r="3" fill="#${accentColor}" opacity=".6"/>
    <text x="24" y="16" class="header" fill="#${accentColor}">Coding Hours</text>
  </g>

  <text x="${cardWidth / 2}" y="85" text-anchor="middle" class="hours" fill="#${accentColor}">${formattedHours}</text>
  <text x="${cardWidth / 2}" y="105" text-anchor="middle" class="text-unit" fill="#8b949e">hours</text>

  <line x1="${P}" y1="115" x2="${cardWidth - P}" y2="115" stroke="#30363d" stroke-width=".5"/>

  <g transform="translate(${P},125)">
    <text x="0" y="12" class="stat" fill="#8b949e">Estimated from commit activity timeline</text>
  </g>
</svg>`;
}

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

module.exports = { generateWorkingHoursSVG, escapeXml };
