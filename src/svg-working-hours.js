/**
 * Working Hours Card SVG generation
 */

function generateWorkingHoursSVG(options) {
  const {
    totalHours = 0,
    joinedDate = new Date(),
    colors,
    hideBorder,
    cardWidth = 460,
  } = options;

  const cardHeight = 160;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;
  const P = 24;
  const accentColor = (colors && colors.accent_color) || "58a6ff";

  const formattedHours = Math.round(totalHours).toLocaleString();

  const joinedTime = new Date(joinedDate);
  const now = new Date();

  const joinedDateStr = joinedTime.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const nowDateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const maxTime = 25 * 365 * 24 * 60 * 60 * 1000;
  const elapsedTime = now - joinedTime;
  const progressPercent = Math.min(100, (elapsedTime / maxTime) * 100);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>
    .header{font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
    .hours{font:700 52px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
    .text-unit{font:500 12px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
    .date{font:400 9px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
  </style>

  <rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
  <rect width="${cardWidth}" height="3" fill="#${accentColor}" rx="8"/>

  <g transform="translate(${P},12)">
    <circle cx="8" cy="8" r="6" fill="none" stroke="#${accentColor}" stroke-width="1.5"/>
    <circle cx="8" cy="8" r="3" fill="#${accentColor}" opacity=".6"/>
    <text x="24" y="16" class="header" fill="#${accentColor}">Coding Hours</text>
  </g>

  <text x="${cardWidth / 2}" y="95" text-anchor="middle" class="hours" fill="#${accentColor}">${formattedHours}</text>
  <text x="${cardWidth / 2}" y="110" text-anchor="middle" class="text-unit" fill="#8b949e">hours</text>

  <rect x="${P}" y="125" width="${cardWidth - P * 2}" height="3" rx="2" fill="#30363d"/>
  <rect x="${P}" y="125" width="${(cardWidth - P * 2) * progressPercent / 100}" height="3" rx="2" fill="#${accentColor}"/>
  <circle cx="${P}" cy="126.5" r="2.5" fill="#${accentColor}" opacity=".6"/>
  <circle cx="${cardWidth - P}" cy="126.5" r="2.5" fill="#${accentColor}"/>

  <line x1="${P}" y1="138" x2="${cardWidth - P}" y2="138" stroke="#30363d" stroke-width=".5"/>

  <text x="${P}" y="${cardHeight - 2}" class="date" fill="#8b949e">${joinedDateStr}</text>
  <text x="${cardWidth - P}" y="${cardHeight - 2}" text-anchor="end" class="date" fill="#8b949e">${nowDateStr}</text>
</svg>`;
}

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

module.exports = { generateWorkingHoursSVG, escapeXml };
