/**
 * SVG generation for Language Usage card.
 * Shows a horizontal stacked bar of languages with percentages.
 * Uses GitHub's official language colors.
 */

const { escapeXml } = require("./svg-pr");
const { getLanguageColor } = require("./languages");

/**
 * Generate language usage bar SVG.
 * Shows top languages with colored horizontal bar.
 */
function generateLanguageSVG(options) {
  const { username, languages, totalBytes, colors, hideBorder, maxLangs = 12 } = options;

  if (!languages || languages.length === 0) {
    return generateNoLangDataSVG(username, colors, hideBorder);
  }

  const topLangs = languages.slice(0, maxLangs);
  const padX = 24;
  const padY = 20;
  const headerHeight = 48;
  const barHeight = 16;
  const barY = headerHeight + 8;
  const listStartY = barY + barHeight + 20;
  const listItemHeight = 24;
  const cols = Math.min(topLangs.length, 6);
  const rows = Math.ceil(topLangs.length / cols);
  const listHeight = rows * listItemHeight;
  const cardWidth = 460;
  const cardHeight = listStartY + listHeight + 16;

  const hideBorderAttr = hideBorder
    ? `rx="8"`
    : `rx="8" stroke="#30363d" stroke-width="1"`;

  // Build the stacked bar
  let barContent = "";
  let barX = padX;
  topLangs.forEach((lang) => {
    const width = (lang.percentage / 100) * (cardWidth - padX * 2);
    if (width > 0.5) {
      const color = getLanguageColor(lang.name);
      barContent += `<rect x="${barX}" y="${barY}" width="${width}" height="${barHeight}" fill="#${color}"/>`;
      barX += width;
    }
  });

  // Build language list
  let langList = "";
  topLangs.forEach((lang, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = padX + col * ((cardWidth - padX * 2) / cols);
    const y = listStartY + row * listItemHeight;
    const color = getLanguageColor(lang.name);
    const pct = lang.percentage >= 10 ? Math.round(lang.percentage) : lang.percentage.toFixed(1);

    langList += `
    <g transform="translate(${x}, ${y})">
      <circle cx="6" cy="10" r="5" fill="#${color}"/>
      <text x="16" y="11" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="11" fill="#e6edf3">${escapeXml(lang.name)}</text>
      <text x="16" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="9" fill="#8b949e">${pct}%</text>
    </g>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>
    .title { font: 600 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  </style>
  <!-- Dark background -->
  <rect x="0" y="0" width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hideBorderAttr}/>
  <!-- Top accent -->
  <rect x="0" y="0" width="${cardWidth}" height="3" fill="#8b5cf6" rx="8"/>
  <!-- Header -->
  <g transform="translate(${padX}, 0)">
    <!-- Code icon -->
    <text x="0" y="30" font-size="18" fill="#8b5cf6">&#x1F4DD;</text>
    <text x="24" y="30" class="title" fill="#e6edf3">${escapeXml(username)}'s Languages</text>
  </g>
  <!-- Stacked bar with rounded corners -->
  <clipPath id="bar-clip">
    <rect x="${padX}" y="${barY}" width="${cardWidth - padX * 2}" height="${barHeight}" rx="8"/>
  </clipPath>
  <g clip-path="url(#bar-clip)">
    ${barContent}
  </g>
  <!-- Language list -->
  ${langList}
</svg>`;
}

/**
 * Compact language card - just the bar and top 5 languages.
 */
function generateLanguageCompactSVG(options) {
  const { username, languages, colors, hideBorder } = options;

  if (!languages || languages.length === 0) {
    return generateNoLangDataSVG(username, colors, hideBorder);
  }

  const topLangs = languages.slice(0, 5);
  const cardWidth = 420;
  const cardHeight = 120;
  const padX = 24;
  const barY = 52;
  const barHeight = 14;

  const hideBorderAttr = hideBorder
    ? `rx="8"`
    : `rx="8" stroke="#30363d" stroke-width="1"`;

  // Build bar
  let barContent = "";
  let barX = padX;
  topLangs.forEach((lang) => {
    const width = (lang.percentage / 100) * (cardWidth - padX * 2);
    if (width > 0.5) {
      const color = getLanguageColor(lang.name);
      barContent += `<rect x="${barX}" y="${barY}" width="${width}" height="${barHeight}" fill="#${color}"/>`;
      barX += width;
    }
  });

  // Language labels below bar
  let labels = "";
  let labelX = padX;
  topLangs.forEach((lang) => {
    const color = getLanguageColor(lang.name);
    const pct = lang.percentage >= 10 ? Math.round(lang.percentage) : lang.percentage.toFixed(1);
    labels += `<circle cx="${labelX + 5}" cy="82" r="4" fill="#${color}"/>`;
    labels += `<text x="${labelX + 13}" y="85" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="10" fill="#8b949e">${escapeXml(lang.name)} ${pct}%</text>`;
    labelX += 80;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>
    .title { font: 600 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  </style>
  <rect x="0" y="0" width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hideBorderAttr}/>
  <rect x="0" y="0" width="${cardWidth}" height="3" fill="#8b5cf6" rx="8"/>
  <text x="${padX}" y="28" class="title" fill="#e6edf3">${escapeXml(username)}'s Languages</text>
  <clipPath id="bar-clip">
    <rect x="${padX}" y="${barY}" width="${cardWidth - padX * 2}" height="${barHeight}" rx="7"/>
  </clipPath>
  <g clip-path="url(#bar-clip)">
    ${barContent}
  </g>
  ${labels}
</svg>`;
}

/**
 * Donut language graph for README showcases.
 */
function generateLanguageDonutSVG(options) {
  const { username, languages, hideBorder } = options;

  if (!languages || languages.length === 0) {
    return generateNoLangDataSVG(username, {}, hideBorder);
  }

  const topLangs = languages.slice(0, 8);
  const cardWidth = 460;
  const cardHeight = 250;
  const cx = 120;
  const cy = 125;
  const radius = 74;
  const strokeW = 22;
  const hideBorderAttr = hideBorder
    ? `rx="8"`
    : `rx="8" stroke="#30363d" stroke-width="1"`;

  let arcs = "";
  let legend = "";
  let acc = 0;

  topLangs.forEach((lang, index) => {
    const pct = lang.percentage;
    const color = getLanguageColor(lang.name);
    const circumference = 2 * Math.PI * radius;
    const seg = (pct / 100) * circumference;
    const offset = circumference * (1 - acc / 100);
    acc += pct;

    arcs += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#${color}" stroke-width="${strokeW}" stroke-dasharray="${seg} ${circumference - seg}" stroke-dashoffset="${offset}" transform="rotate(-90 ${cx} ${cy})"><title>${escapeXml(lang.name)}: ${pct.toFixed(1)}%</title></circle>`;

    const ly = 52 + index * 22;
    legend += `<circle cx="228" cy="${ly}" r="5" fill="#${color}"/>`;
    legend += `<text x="240" y="${ly + 4}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#e6edf3">${escapeXml(lang.name)}</text>`;
    legend += `<text x="430" y="${ly + 4}" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#8b949e">${pct.toFixed(1)}%</text>`;
  });

  const top = topLangs[0];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <rect x="0" y="0" width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hideBorderAttr}/>
  <rect x="0" y="0" width="${cardWidth}" height="3" fill="#58a6ff" rx="8"/>
  <text x="24" y="30" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="14" font-weight="600" fill="#e6edf3">${escapeXml(username)}'s Language Donut</text>
  <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#1f2937" stroke-width="${strokeW}"/>
  ${arcs}
  <circle cx="${cx}" cy="${cy}" r="${radius - strokeW}" fill="#0d1117"/>
  <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" fill="#8b949e">Top language</text>
  <text x="${cx}" y="${cy + 16}" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="14" font-weight="700" fill="#e6edf3">${escapeXml(top.name)}</text>
  ${legend}
</svg>`;
}

function generateNoLangDataSVG(username, colors, hideBorder) {
  const cardWidth = 400;
  const cardHeight = 100;
  const hideBorderAttr = hideBorder
    ? `rx="8"`
    : `rx="8" stroke="#30363d" stroke-width="1"`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <rect x="0" y="0" width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hideBorderAttr}/>
  <text x="${cardWidth / 2}" y="50" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" fill="#e6edf3">${escapeXml(username)}'s Languages</text>
  <text x="${cardWidth / 2}" y="72" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="11" fill="#8b949e">No language data found</text>
</svg>`;
}

module.exports = {
  generateLanguageSVG,
  generateLanguageCompactSVG,
  generateLanguageDonutSVG,
};
