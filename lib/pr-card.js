/**
 * PR Card — Classic GitHub dark theme
 * Shows pull requests grouped by repo
 */

function generatePRCard({ username, pullRequests = [] }) {
  const C = {
    bg:        "#0d1117",
    border:    "#30363d",
    headerBg:  "#161b22",
    divider:   "#21262d",
    title:     "#e6edf3",
    sub:       "#8b949e",
    repoLink:  "#58a6ff",
    prTitle:   "#e6edf3",
    prNum:     "#8b949e",
    open:      "#3fb950",
    merged:    "#a371f7",
    closed:    "#f85149",
    countBg:   "#21262d",
    countText: "#8b949e",
  };

  const FONT = "system-ui,-apple-system,'Segoe UI',sans-serif";
  const MONO = "'SFMono-Regular',Consolas,'Liberation Mono',monospace";

  // Group PRs by repo
  const byRepo = {};
  for (const pr of pullRequests) {
    if (!byRepo[pr.repo]) byRepo[pr.repo] = [];
    byRepo[pr.repo].push(pr);
  }
  const repos = Object.keys(byRepo);

  const W         = 495;
  const PAD       = 16;
  const HEADER_H  = 60;
  const REPO_H    = 36;
  const PR_H      = 34;
  const GAP       = 8;

  let bodyH = PAD;
  for (const r of repos) bodyH += REPO_H + byRepo[r].length * PR_H + GAP;
  if (repos.length === 0) bodyH = 80;
  const H = HEADER_H + bodyH;

  let rows = "";
  let y = HEADER_H + PAD;

  if (repos.length === 0) {
    rows = `<text x="${W/2}" y="${HEADER_H + 44}" text-anchor="middle"
      font-family="${FONT}" font-size="13" fill="${C.sub}">No pull requests found.</text>`;
  }

  for (const repo of repos) {
    const prs = byRepo[repo];

    // Repo header row
    rows += `
      <rect x="${PAD}" y="${y}" width="${W - PAD*2}" height="${REPO_H}"
        rx="6" fill="${C.headerBg}" stroke="${C.border}" stroke-width="1"/>
      <text x="${PAD + 12}" y="${y + 23}" font-family="${FONT}" font-size="12"
        fill="${C.sub}">⎇</text>
      <text x="${PAD + 26}" y="${y + 23}" font-family="${FONT}" font-size="13"
        font-weight="600" fill="${C.repoLink}">${xe(username)}/${xe(repo)}</text>
      <rect x="${W - PAD - 32}" y="${y + 9}" width="22" height="18" rx="9" fill="${C.countBg}"/>
      <text x="${W - PAD - 21}" y="${y + 22}" text-anchor="middle" font-family="${FONT}"
        font-size="11" font-weight="600" fill="${C.countText}">${prs.length}</text>
    `;
    y += REPO_H;

    // PR rows under this repo
    for (let i = 0; i < prs.length; i++) {
      const pr = prs[i];
      const sc = pr.state === "merged" ? C.merged : pr.state === "open" ? C.open : C.closed;
      const sl = pr.state === "merged" ? "Merged" : pr.state === "open" ? "Open" : "Closed";

      // Row background
      rows += `<rect x="${PAD}" y="${y}" width="${W - PAD*2}" height="${PR_H}"
        fill="${C.headerBg}" stroke="${C.border}" stroke-width="0"
        stroke-dasharray="0"/>`;

      // Left border accent by state
      rows += `<rect x="${PAD}" y="${y}" width="3" height="${PR_H}" fill="${sc}" opacity="0.6"/>`;

      // Horizontal divider (between rows)
      rows += `<line x1="${PAD}" y1="${y}" x2="${W - PAD}" y2="${y}"
        stroke="${C.divider}" stroke-width="1"/>`;

      // State dot
      rows += `<circle cx="${PAD + 18}" cy="${y + PR_H/2}" r="4" fill="${sc}"/>`;

      // PR number
      rows += `<text x="${PAD + 30}" y="${y + PR_H/2 + 4}" font-family="${MONO}"
        font-size="11" fill="${C.prNum}">#${pr.number}</text>`;

      // PR title
      rows += `<text x="${PAD + 70}" y="${y + PR_H/2 + 4}" font-family="${FONT}"
        font-size="12" fill="${C.prTitle}">${xe(trunc(pr.title, 40))}</text>`;

      // State badge
      rows += `
        <rect x="${W - PAD - 54}" y="${y + PR_H/2 - 9}" width="46" height="17"
          rx="8" fill="${sc}22" stroke="${sc}66" stroke-width="1"/>
        <text x="${W - PAD - 31}" y="${y + PR_H/2 + 4}" text-anchor="middle"
          font-family="${FONT}" font-size="10" font-weight="600" fill="${sc}">${sl}</text>
      `;

      // Bottom border for last row in this repo
      if (i === prs.length - 1) {
        rows += `<line x1="${PAD}" y1="${y + PR_H}" x2="${W - PAD}" y2="${y + PR_H}"
          stroke="${C.border}" stroke-width="1"/>`;
        rows += `<rect x="${PAD}" y="${y}" width="${W - PAD*2}" height="${PR_H}"
          rx="0" fill="transparent" stroke="${C.border}" stroke-width="0"/>`;
        // close the repo block with a bottom border
        rows += `<rect x="${PAD}" y="${HEADER_H + PAD + (y - HEADER_H - PAD - REPO_H)}"
          width="${W - PAD*2}" height="${REPO_H + prs.length * PR_H}"
          rx="6" fill="transparent" stroke="${C.border}" stroke-width="1"/>`;
      }

      y += PR_H;
    }

    y += GAP;
  }

  const total  = pullRequests.length;
  const open   = pullRequests.filter(p => p.state === "open").length;
  const merged = pullRequests.filter(p => p.state === "merged").length;
  const closed = pullRequests.filter(p => p.state === "closed").length;

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"
  xmlns="http://www.w3.org/2000/svg" role="img"
  aria-label="Pull Requests – ${xe(username)}">
  <title>${xe(username)} Pull Requests</title>

  <!-- Card shell -->
  <rect width="${W}" height="${H}" rx="8" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>

  <!-- Header band -->
  <rect width="${W}" height="${HEADER_H}" rx="8" fill="${C.headerBg}"/>
  <rect y="${HEADER_H - 8}" width="${W}" height="8" fill="${C.headerBg}"/>
  <line x1="0" y1="${HEADER_H}" x2="${W}" y2="${HEADER_H}" stroke="${C.border}" stroke-width="1"/>

  <!-- Header icon (octicon pull-request) -->
  <g transform="translate(17,16) scale(1.45)" fill="${C.sub}">
    <path fill-rule="evenodd" d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 0 7 8.5h1.5v1.128a2.251
      2.251 0 1 1-1.5 0V8.5H7A1 1 0 0 1 6 7.5V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677 8.06a.75.75 0 1 0
      1.06 1.061.75.75 0 0 0-1.06-1.06ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM2.5 9.5a.75.75
      0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"/>
  </g>

  <!-- Header text -->
  <text x="46" y="29" font-family="${FONT}" font-size="16" font-weight="700"
    fill="${C.title}">Pull Requests</text>
  <text x="46" y="48" font-family="${FONT}" font-size="12" fill="${C.sub}">
    @${xe(username)} &nbsp;·&nbsp; ${total} total
  </text>

  <!-- Stat counters -->
  <rect x="${W - 186}" y="14" width="52" height="20" rx="10" fill="${C.open}1a" stroke="${C.open}55" stroke-width="1"/>
  <circle cx="${W - 172}" cy="24" r="3.5" fill="${C.open}"/>
  <text x="${W - 165}" y="28" font-family="${FONT}" font-size="10" font-weight="600" fill="${C.open}">${open} open</text>

  <rect x="${W - 130}" y="14" width="60" height="20" rx="10" fill="${C.merged}1a" stroke="${C.merged}55" stroke-width="1"/>
  <circle cx="${W - 116}" cy="24" r="3.5" fill="${C.merged}"/>
  <text x="${W - 109}" y="28" font-family="${FONT}" font-size="10" font-weight="600" fill="${C.merged}">${merged} merged</text>

  <rect x="${W - 66}" y="14" width="52" height="20" rx="10" fill="${C.closed}1a" stroke="${C.closed}55" stroke-width="1"/>
  <circle cx="${W - 52}" cy="24" r="3.5" fill="${C.closed}"/>
  <text x="${W - 45}" y="28" font-family="${FONT}" font-size="10" font-weight="600" fill="${C.closed}">${closed} closed</text>

  <!-- Body rows -->
  ${rows}
</svg>`;
}

function xe(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function trunc(s, n) { return s.length > n ? s.slice(0, n-1)+"…" : s; }

module.exports = { generatePRCard };
