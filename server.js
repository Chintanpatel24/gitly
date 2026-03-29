/**
 * GitHub Cards – Public SVG API Server
 *
 * Routes:
 *   GET /api/pr-card?username=USERNAME
 *   GET /api/contrib-card?username=USERNAME
 *   GET /                   (docs)
 */

const http   = require("http");
const url    = require("url");
const { generatePRCard }      = require("./lib/pr-card");
const { generateContribCard } = require("./lib/contrib-card");
const { fetchUserPRs, fetchContributions } = require("./lib/github");

const PORT = process.env.PORT || 3000;

// ── Simple in-memory cache ─────────────────────────────────────────────────
const CACHE     = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 min

function getCached(key) {
  const e = CACHE.get(key);
  return e && Date.now() - e.ts < CACHE_TTL ? e.val : null;
}
function setCache(key, val) { CACHE.set(key, { val, ts: Date.now() }); }

// ── Response helpers ───────────────────────────────────────────────────────
function sendSVG(res, svg) {
  res.writeHead(200, {
    "Content-Type": "image/svg+xml; charset=utf-8",
    "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(svg);
}

function errorSVG(message) {
  return `<svg width="495" height="80" viewBox="0 0 495 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="495" height="80" rx="8" fill="#0d1117" stroke="#f85149" stroke-width="1"/>
    <text x="16" y="34" font-family="system-ui,sans-serif" font-size="14" font-weight="600" fill="#f85149">Error</text>
    <text x="16" y="56" font-family="system-ui,sans-serif" font-size="12" fill="#8b949e">${message}</text>
  </svg>`;
}

// ── Route handlers ─────────────────────────────────────────────────────────
async function handlePRCard(query, res) {
  const username = (query.username || "").trim().toLowerCase();
  if (!username) return sendSVG(res, errorSVG("?username= is required"));

  const key = `pr:${username}`;
  const cached = getCached(key);
  if (cached) return sendSVG(res, cached);

  let svg;
  try {
    const prs = await fetchUserPRs(username);
    svg = generatePRCard({ username, pullRequests: prs });
  } catch (err) {
    svg = generatePRCard({ username, pullRequests: [] });
  }
  setCache(key, svg);
  sendSVG(res, svg);
}

async function handleContribCard(query, res) {
  const username = (query.username || "").trim().toLowerCase();
  if (!username) return sendSVG(res, errorSVG("?username= is required"));

  const key = `contrib:${username}`;
  const cached = getCached(key);
  if (cached) return sendSVG(res, cached);

  let svg;
  try {
    const data = await fetchContributions(username);
    svg = generateContribCard({ username, contributions: data });
  } catch (err) {
    svg = errorSVG("Could not fetch contribution data.");
  }
  setCache(key, svg);
  sendSVG(res, svg);
}

// ── Docs page ──────────────────────────────────────────────────────────────
function docsPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>GitHub Cards API</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:#0d1117;color:#e6edf3;padding:48px 24px;max-width:780px;margin:0 auto}
  h1{font-size:24px;font-weight:700;color:#e6edf3;margin-bottom:4px}
  .sub{color:#8b949e;font-size:14px;margin-bottom:40px}
  h2{font-size:16px;font-weight:600;color:#e6edf3;margin:36px 0 12px;border-bottom:1px solid #21262d;padding-bottom:8px}
  p{color:#8b949e;font-size:13px;line-height:1.7;margin-bottom:12px}
  .box{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:16px 20px;margin-bottom:12px}
  .url{font-family:'SFMono-Regular',Consolas,monospace;font-size:13px;color:#58a6ff;word-break:break-all}
  .params{margin-top:12px;font-size:12px;color:#8b949e}
  .params tr td:first-child{color:#f0883e;font-family:monospace;padding-right:16px;white-space:nowrap}
  .params td{padding:4px 0}
  .embed{background:#010409;border:1px solid #21262d;border-radius:6px;padding:14px 16px;font-family:monospace;font-size:12px;color:#79c0ff;line-height:1.8;margin-top:8px}
  .badge{display:inline-flex;align-items:center;gap:6px;background:#21262d;border:1px solid #30363d;border-radius:20px;padding:5px 12px;font-size:11px;color:#8b949e;margin-top:20px}
</style>
</head>
<body>
<h1>GitHub Cards</h1>
<p class="sub">Drop-in SVG cards for any GitHub README. Just change the username in the URL.</p>

<h2>Card 1 — Pull Request Tracker</h2>
<p>Shows all your pull requests grouped by repository, with number, title, and state (open / merged / closed).</p>
<div class="box">
  <div class="url">GET /api/pr-card?username=<strong>YOUR_USERNAME</strong></div>
  <table class="params">
    <tr><td>username</td><td>GitHub username (required)</td></tr>
  </table>
</div>
<div class="embed">&lt;img src="https://YOUR-DOMAIN/api/pr-card?username=torvalds" /&gt;</div>

<h2>Card 2 — Commit Heatmap</h2>
<p>A 53-week contribution grid where every cell shows the <strong>actual commit count</strong> as a number. Color scale follows GitHub's dark theme exactly: darker green for fewer commits, brighter green for more.</p>
<div class="box">
  <div class="url">GET /api/contrib-card?username=<strong>YOUR_USERNAME</strong></div>
  <table class="params">
    <tr><td>username</td><td>GitHub username (required)</td></tr>
  </table>
</div>
<div class="embed">&lt;img src="https://YOUR-DOMAIN/api/contrib-card?username=torvalds" /&gt;</div>

<h2>How to use in your README</h2>
<div class="embed">## My GitHub Stats

&lt;img src="https://YOUR-DOMAIN/api/pr-card?username=YOUR_USERNAME" /&gt;

&lt;img src="https://YOUR-DOMAIN/api/contrib-card?username=YOUR_USERNAME" /&gt;</div>

<h2>Deploy</h2>
<p>Deploy to Vercel in one click. Then add a <code>GITHUB_TOKEN</code> environment variable (with <code>read:user</code> scope) for real contribution data. Without a token, the server falls back to the public Events API (last 100 push events).</p>

<div class="badge">⚡ SVG · Cache: 5 min · No auth needed for PR card · CORS open</div>
</body>
</html>`;
}

// ── Main server ────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  try {
    if      (pathname === "/api/pr-card")     await handlePRCard(query, res);
    else if (pathname === "/api/contrib-card") await handleContribCard(query, res);
    else if (pathname === "/" || pathname === "/index.html") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(docsPage());
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
    }
  } catch (err) {
    sendSVG(res, errorSVG("Internal server error"));
  }
});

server.listen(PORT, () => {
  console.log(`\nGitHub Cards running → http://localhost:${PORT}\n`);
  console.log(`  PR card:      http://localhost:${PORT}/api/pr-card?username=torvalds`);
  console.log(`  Contrib card: http://localhost:${PORT}/api/contrib-card?username=torvalds\n`);
});

module.exports = server;
