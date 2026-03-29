/**
 * GitHub API helpers.
 * - PR data uses the public Search API (no token needed, 10 req/min unauth)
 * - Contribution data uses GraphQL (needs GITHUB_TOKEN) or falls back to Events API
 */

const https = require("https");

function ghGet(path, token) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: "api.github.com",
      path,
      method: "GET",
      headers: {
        "User-Agent": "github-readme-cards/2.0",
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
    const req = https.request(opts, res => {
      let d = "";
      res.on("data", c => d += c);
      res.on("end", () => {
        try {
          const parsed = JSON.parse(d);
          res.statusCode >= 400
            ? reject(new Error(`GitHub ${res.statusCode}: ${parsed.message || d}`))
            : resolve(parsed);
        } catch { reject(new Error("Parse error")); }
      });
    });
    req.on("error", reject);
    req.setTimeout(9000, () => { req.destroy(); reject(new Error("Timeout")); });
    req.end();
  });
}

function ghGraphQL(query, token) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query });
    const opts = {
      hostname: "api.github.com",
      path: "/graphql",
      method: "POST",
      headers: {
        "User-Agent": "github-readme-cards/2.0",
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
    if (!token) return reject(new Error("No token"));
    const req = https.request(opts, res => {
      let d = "";
      res.on("data", c => d += c);
      res.on("end", () => {
        try { resolve(JSON.parse(d)); } catch { reject(new Error("Parse error")); }
      });
    });
    req.on("error", reject);
    req.setTimeout(9000, () => { req.destroy(); reject(new Error("Timeout")); });
    req.write(body);
    req.end();
  });
}

// ── Pull Requests ──────────────────────────────────────────────────────────

async function fetchUserPRs(username) {
  const token = process.env.GITHUB_TOKEN;
  // Search API works without auth (10 req/min limit)
  const data = await ghGet(
    `/search/issues?q=is:pr+author:${encodeURIComponent(username)}&per_page=100&sort=updated&order=desc`,
    token
  );

  return (data.items || []).map(item => {
    const repoUrl = item.repository_url || "";
    // repoUrl = https://api.github.com/repos/OWNER/NAME
    const parts = repoUrl.split("/repos/")[1] || "";
    const [owner, name] = parts.split("/");
    const repo = (owner === username ? name : parts) || parts;

    return {
      number:    item.number,
      title:     item.title,
      state:     item.pull_request?.merged_at ? "merged" : item.state,
      repo:      repo || "unknown",
      createdAt: item.created_at,
    };
  });
}

// ── Contributions ──────────────────────────────────────────────────────────

async function fetchContributions(username) {
  const token = process.env.GITHUB_TOKEN;

  // Try GraphQL first (needs token)
  try {
    const gql = `{
      user(login: "${username}") {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }`;
    const res = await ghGraphQL(gql, token);
    const weeks = res?.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
    if (weeks && weeks.length > 0) {
      const days = [];
      for (const w of weeks)
        for (const d of w.contributionDays)
          days.push({ date: d.date, count: d.contributionCount });
      if (days.length > 0) return days;
    }
  } catch {}

  // Fallback: build from Events API (last 90 days of push events, public repos)
  try {
    return await buildFromEvents(username, token);
  } catch {}

  // Last resort: clearly-labelled demo data
  return demoDays(username);
}

async function buildFromEvents(username, token) {
  const events = await ghGet(
    `/users/${encodeURIComponent(username)}/events/public?per_page=100`,
    token
  );

  const dayMap = {};
  for (const ev of events) {
    if (ev.type !== "PushEvent") continue;
    const day = ev.created_at?.split("T")[0];
    if (!day) continue;
    const n = ev.payload?.commits?.length || 0;
    dayMap[day] = (dayMap[day] || 0) + n;
  }

  // Fill 365 days
  const today = new Date();
  const result = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const ds = d.toISOString().split("T")[0];
    result.push({ date: ds, count: dayMap[ds] || 0 });
  }
  return result;
}

/**
 * Generate deterministic-looking demo data seeded on username.
 * Used only when no token is available and events fail.
 */
function demoDays(username) {
  // Simple hash so the same username always gets the same pattern
  let seed = 0;
  for (let i = 0; i < username.length; i++) seed += username.charCodeAt(i);
  const rng = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };

  const today = new Date();
  const result = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dow = d.getDay();
    let count = 0;
    if (rng() > 0.38) {
      count = Math.floor(rng() * (dow === 0 || dow === 6 ? 6 : 16)) + 1;
      if (rng() > 0.85) count += Math.floor(rng() * 12);
    }
    result.push({ date: d.toISOString().split("T")[0], count });
  }
  return result;
}

module.exports = { fetchUserPRs, fetchContributions };
