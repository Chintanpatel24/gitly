/**
 * Commits Ranking SVG Card
 * Shows contribution days ranked from highest to lowest commit count.
 */

const { escapeXml } = require("./svg-pr");

function generateCommitsRankingSVG(options) {
  const { days, totalContributions, colors, hideBorder, cardWidth = 460 } = options;

  if (!days || days.length === 0) {
    return noDataSVG(hideBorder);
  }

  const activeDays = days.filter(d => d.count > 0).sort((a, b) => b.count - a.count);

  if (activeDays.length === 0) {
    return noDataSVG(hideBorder);
  }

  const maxShow = Math.min(activeDays.length, 12);
  const rowH = 30;
  const pad = 24;
  const hdr = 60;
  const cardHeight = hdr + maxShow * rowH + 8;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;

  const accentColor = (colors && colors.accent_color) || "39d353";
  const titleColor = (colors && colors.title_color) || "e6edf3";

  const maxCount = activeDays[0].count;

  const formatDate = (dateStr) => {
    const d = new Date(`${dateStr}T00:00:00`);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  let rows = "";
  activeDays.slice(0, maxShow).forEach((day, i) => {
    const y = hdr + i * rowH;
    const dateLabel = formatDate(day.date);
    const pct = Math.min((day.count / maxCount) * 100, 100);
    const rank = i + 1;
    const rankColor = rank <= 3 ? accentColor : "8b949e";

    rows += `<g transform="translate(0,${y})">
      <rect width="${cardWidth}" height="${rowH}" fill="#e6edf3" opacity="${i % 2 === 0 ? '.02' : '0'}"/>
      <text x="${pad}" y="20" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" font-weight="700" fill="#${rankColor}">#${rank}</text>
      <text x="${pad + 34}" y="20" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" fill="#c9d1d9">${dateLabel}</text>
      <rect x="${cardWidth - pad - 100}" y="9" width="60" height="12" rx="6" fill="#30363d"/>
      <rect x="${cardWidth - pad - 100}" y="9" width="${pct * 0.6}" height="12" rx="6" fill="#${accentColor}" opacity=".5"/>
      <text x="${cardWidth - pad - 20}" y="20" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="14" font-weight="700" fill="#${accentColor}">${day.count}</text>
    </g>`;
  });

  if (activeDays.length > maxShow) {
    rows += `<text x="${cardWidth / 2}" y="${hdr + maxShow * rowH + 6}" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e" opacity=".5">+${activeDays.length - maxShow} more active days</text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>.t{font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.n{font:700 18px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}</style>
  <rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
  <rect width="${cardWidth}" height="3" fill="#${accentColor}" rx="8"/>
  <circle cx="${pad + 6}" cy="22" r="5" fill="#${accentColor}" opacity=".2"/><circle cx="${pad + 6}" cy="22" r="2.5" fill="#${accentColor}"/>
  <text x="${pad + 16}" y="26" class="t" fill="#${titleColor}">Commits</text>
  <rect x="${cardWidth - pad - 80}" y="10" width="80" height="28" rx="12" fill="#${accentColor}" opacity=".12"/>
  <text x="${cardWidth - pad - 40}" y="29" text-anchor="middle" class="n" fill="#${accentColor}">${totalContributions}</text>
  <line x1="${pad}" y1="${hdr - 4}" x2="${cardWidth - pad}" y2="${hdr - 4}" stroke="#30363d" stroke-width=".5"/>
  ${rows}
</svg>`;
}

function generateCommitsCompactSVG(options) {
  const { days, totalContributions, colors, hideBorder } = options;

  if (!days || days.length === 0) {
    return noDataSVG(hideBorder);
  }

  const activeDays = days.filter(d => d.count > 0).sort((a, b) => b.count - a.count);

  if (activeDays.length === 0) {
    return noDataSVG(hideBorder);
  }

  const W = 460, H = 140, P = 24;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;
  const accentColor = (colors && colors.accent_color) || "39d353";

  const bestDay = activeDays[0];
  const avgCommits = (totalContributions / days.length).toFixed(1);
  const activeCount = activeDays.length;

  const formatDate = (dateStr) => {
    const d = new Date(`${dateStr}T00:00:00`);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getMonth()]} ${d.getDate()}`;
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<style>.t{font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.n{font:700 30px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.l{font:400 11px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}</style>
<rect width="${W}" height="${H}" fill="#0d1117" ${hba}/>
<rect width="${W}" height="3" fill="#${accentColor}" rx="8"/>
<circle cx="${P + 6}" cy="22" r="5" fill="#${accentColor}" opacity=".2"/><circle cx="${P + 6}" cy="22" r="2.5" fill="#${accentColor}"/>
<text x="${P + 16}" y="26" class="t" fill="#e6edf3">Commits</text>
<line x1="${P}" y1="42" x2="${W - P}" y2="42" stroke="#30363d" stroke-width=".5"/>
<g transform="translate(${P},52)"><rect width="130" height="72" rx="8" fill="#${accentColor}" opacity=".06"/><text x="65" y="35" text-anchor="middle" class="n" fill="#${accentColor}">${bestDay.count}</text><text x="65" y="52" text-anchor="middle" class="l" fill="#8b949e">Best Day (${formatDate(bestDay.date)})</text></g>
<g transform="translate(${P + 142},52)"><rect width="130" height="72" rx="8" fill="#58a6ff" opacity=".06"/><text x="65" y="35" text-anchor="middle" class="n" fill="#58a6ff">${activeCount}</text><text x="65" y="52" text-anchor="middle" class="l" fill="#8b949e">Active Days</text></g>
<g transform="translate(${P + 284},52)"><rect width="130" height="72" rx="8" fill="#e6edf3" opacity=".04"/><text x="65" y="35" text-anchor="middle" class="n" fill="#e6edf3">${avgCommits}</text><text x="65" y="52" text-anchor="middle" class="l" fill="#8b949e">Daily Avg</text></g>
</svg>`;
}

function noDataSVG(hideBorder) {
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="120" viewBox="0 0 460 120">
<rect width="460" height="120" fill="#0d1117" ${hba}/>
<text x="230" y="55" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="14" fill="#e6edf3">Commits</text>
<text x="230" y="78" text-anchor="middle" font-family="-apple-system,sans-serif" font-size="11" fill="#8b949e">No data found</text>
</svg>`;
}

module.exports = {
  generateCommitsRankingSVG,
  generateCommitsCompactSVG,
};
