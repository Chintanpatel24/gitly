function generateContribCard({ username, contributions = [] }) {
  const SCALE = [
    { bg: "#161b22", text: "transparent" },
    { bg: "#0e4429", text: "#39d353"     },
    { bg: "#006d32", text: "#cae8c4"     },
    { bg: "#26a641", text: "#033a16"     },
    { bg: "#39d353", text: "#033a16"     },
  ];

  function level(n) {
    if (n === 0)  return 0;
    if (n <= 3)   return 1;
    if (n <= 7)   return 2;
    if (n <= 15)  return 3;
    return 4;
  }

  const FONT = "system-ui,-apple-system,'Segoe UI',sans-serif";
  const MONO = "'SFMono-Regular',Consolas,'Liberation Mono',monospace";
  const C = {
    bg:     "#0d1117",
    border: "#30363d",
    hdrBg:  "#161b22",
    title:  "#e6edf3",
    sub:    "#8b949e",
  };

  const CELL  = 14;
  const GAP   = 3;
  const STEP  = CELL + GAP;
  const WEEKS = 53;
  const DAYS  = 7;
  const LPAD  = 30;
  const TPAD  = 58;
  const MPAD  = 22;
  const RPAD  = 16;
  const BPAD  = 30;

  const GRID_W = WEEKS * STEP - GAP;
  const GRID_H = DAYS  * STEP - GAP;
  const W = LPAD + GRID_W + RPAD;
  const H = TPAD + MPAD + GRID_H + BPAD;

  const dateMap = {};
  for (const c of contributions) dateMap[c.date] = c.count;

  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay() - 52 * 7);

  let cells = "";
  const monthPos = {};

  for (let w = 0; w < WEEKS; w++) {
    for (let d = 0; d < DAYS; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      if (date > today) continue;

      const ds    = date.toISOString().split("T")[0];
      const count = dateMap[ds] || 0;
      const lv    = level(count);
      const col   = SCALE[lv];

      const cx = LPAD + w * STEP;
      const cy = TPAD + MPAD + d * STEP;

      const mkey = `${date.getFullYear()}-${date.getMonth()}`;
      if (d === 0 && !(mkey in monthPos)) monthPos[mkey] = cx;

      const label = count === 0 ? "" : count > 99 ? "99" : String(count);
      const fs    = count >= 10 ? 6 : 7;

      cells += `<rect x="${cx}" y="${cy}" width="${CELL}" height="${CELL}" rx="2"
        fill="${col.bg}" stroke="#ffffff08" stroke-width="0.5">
        <title>${ds}: ${count} commits</title></rect>`;

      if (label) {
        cells += `<text x="${cx + CELL/2}" y="${cy + CELL/2 + fs*0.38}"
          text-anchor="middle" dominant-baseline="middle"
          font-family="${MONO}" font-size="${fs}" font-weight="700"
          fill="${col.text}" pointer-events="none">${label}</text>`;
      }
    }
  }

  const MN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let monthLabels = "";
  for (const [key, mx] of Object.entries(monthPos)) {
    const mo = parseInt(key.split("-")[1]);
    monthLabels += `<text x="${mx}" y="${TPAD + MPAD - 5}"
      font-family="${FONT}" font-size="10" fill="${C.sub}">${MN[mo]}</text>`;
  }

  const DN = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  let dayLabels = "";
  for (let d = 1; d < 7; d += 2) {
    dayLabels += `<text x="${LPAD - 4}" y="${TPAD + MPAD + d * STEP + CELL - 2}"
      font-family="${FONT}" font-size="9" fill="${C.sub}" text-anchor="end">${DN[d]}</text>`;
  }

  const LX = LPAD;
  const LY = H - 20;
  let legend = `<text x="${LX}" y="${LY + 10}" font-family="${FONT}" font-size="9" fill="${C.sub}">Less</text>`;
  SCALE.forEach((col, i) => {
    legend += `<rect x="${LX + 28 + i*(CELL-1+2)}" y="${LY}" width="${CELL-1}" height="${CELL-1}"
      rx="2" fill="${col.bg}" stroke="#ffffff10" stroke-width="0.5"/>`;
  });
  legend += `<text x="${LX + 28 + SCALE.length*(CELL+1) + 4}" y="${LY + 10}"
    font-family="${FONT}" font-size="9" fill="${C.sub}">More</text>`;

  const totalCommits = contributions.reduce((s, c) => s + c.count, 0);
  const activeDays   = contributions.filter(c => c.count > 0).length;

  let best = 0, cur = 0;
  const sorted = [...contributions].sort((a,b) => a.date.localeCompare(b.date));
  for (const c of sorted) { if (c.count > 0) { cur++; if (cur > best) best = cur; } else cur = 0; }

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"
  xmlns="http://www.w3.org/2000/svg" role="img"
  aria-label="Contribution Graph - ${xe(username)}">
  <title>${xe(username)} - Contribution Graph</title>

  <rect width="${W}" height="${H}" rx="8" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <rect width="${W}" height="${TPAD}" rx="8" fill="${C.hdrBg}"/>
  <rect y="${TPAD - 8}" width="${W}" height="8" fill="${C.hdrBg}"/>
  <line x1="0" y1="${TPAD}" x2="${W}" y2="${TPAD}" stroke="${C.border}" stroke-width="1"/>

  <g transform="translate(17,15)" fill="${C.sub}">
    <rect x="0" y="8" width="3" height="6" rx="1"/>
    <rect x="5" y="4" width="3" height="10" rx="1"/>
    <rect x="10" y="0" width="3" height="14" rx="1"/>
    <rect x="15" y="6" width="3" height="8" rx="1"/>
    <rect x="20" y="2" width="3" height="12" rx="1"/>
  </g>

  <text x="50" y="30" font-family="${FONT}" font-size="15" font-weight="700" fill="${C.title}">Contribution Graph</text>
  <text x="50" y="48" font-family="${FONT}" font-size="11" fill="${C.sub}">@${xe(username)} - ${totalCommits} commits - ${activeDays} active days - ${best}d streak</text>

  ${monthLabels}
  ${dayLabels}
  ${cells}
  ${legend}
</svg>`;
}

function xe(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

module.exports = { generateContribCard };
