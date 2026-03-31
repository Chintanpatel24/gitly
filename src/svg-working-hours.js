/**
 * Working Hours Card SVG generation
 * Calculates estimated working hours based on GitHub activity
 */

function generateWorkingHoursSVG(options) {
  const {
    username,
    totalHours = 0,
    joinedDate = new Date(),
    activeContributions = 0,
    activeDays = 0,
    colors,
    hideBorder,
    cardWidth = 460,
  } = options;

  const cardHeight = 160;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;
  const P = 24;
  const accentColor = (colors && colors.accent_color) || "58a6ff";
  const titleColor = (colors && colors.title_color) || "58a6ff";

  // Format the number with proper separators
  const formattedHours = Math.round(totalHours).toLocaleString();
  
  // Get dates for timeline
  const joinedTime = new Date(joinedDate);
  const now = new Date();
  
  // Format dates
  const joinedDateStr = joinedTime.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const nowDateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  
  // Calculate progress percentage (0 to 100)
  // Assume max career on GitHub is ~25 years (2000-2025)
  const maxTime = 25 * 365 * 24 * 60 * 60 * 1000;
  const elapsedTime = now - joinedTime;
  const progressPercent = Math.min(100, (elapsedTime / maxTime) * 100);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>
    .header{font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
    .hours{font:700 56px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
    .text-unit{font:500 12px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
    .date{font:400 9px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
  </style>
  
  <defs>
    <linearGradient id="hoursGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#${accentColor};stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:#${accentColor};stop-opacity:0" />
    </linearGradient>
  </defs>

  <!-- Main card -->
  <rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
  <rect width="${cardWidth}" height="3" fill="#${accentColor}" rx="8"/>
  
  <!-- Header gradient -->
  <rect y="3" width="${cardWidth}" height="40" fill="url(#hoursGrad)"/>
  
  <!-- Timeline icon + Header -->
  <g transform="translate(${P},12)">
    <line x1="3" y1="2" x2="3" y2="12" stroke="#${accentColor}" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="3" cy="2" r="2.5" fill="#${accentColor}"/>
    <circle cx="3" cy="12" r="2.5" fill="#${accentColor}" opacity=".5"/>
    <line x1="8" y1="7" x2="13" y2="7" stroke="#${accentColor}" stroke-width="1.5" stroke-linecap="round"/>
    <text x="20" y="16" class="header" fill="#${titleColor}">Coding Hours</text>
  </g>
  
  <!-- Hours count with "hours" label -->
  <text x="${cardWidth / 2}" y="95" text-anchor="middle" class="hours" fill="#${accentColor}">${formattedHours}</text>
  <text x="${cardWidth / 2}" y="110" text-anchor="middle" class="text-unit" fill="#8b949e">hours</text>
  
  <!-- Timeline from join date to now -->
  <!-- Background timeline track -->
  <rect x="${P}" y="125" width="${cardWidth - P * 2}" height="3" rx="2" fill="#30363d"/>
  
  <!-- Progress bar (colored portion) -->
  <rect x="${P}" y="125" width="${(cardWidth - P * 2) * progressPercent / 100}" height="3" rx="2" fill="#${accentColor}"/>
  
  <!-- Start and end dots -->
  <circle cx="${P}" cy="126.5" r="2.5" fill="#${accentColor}" opacity=".6"/>
  <circle cx="${cardWidth - P}" cy="126.5" r="2.5" fill="#${accentColor}"/>
  
  <!-- Divider line -->
  <line x1="${P}" y1="138" x2="${cardWidth - P}" y2="138" stroke="#30363d" stroke-width=".5"/>
  
  <!-- Date labels -->
  <text x="${P}" y="${cardHeight - 2}" class="date" fill="#8b949e">${joinedDateStr}</text>
  <text x="${cardWidth - P}" y="${cardHeight - 2}" text-anchor="end" class="date" fill="#8b949e">${nowDateStr}</text>
</svg>`;
}

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

module.exports = { generateWorkingHoursSVG, escapeXml };
