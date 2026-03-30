/**
 * GitHub API helpers for fetching user data (no auth required).
 */

const GITHUB_API = "https://api.github.com";

/**
 * Fetch all pull requests by a user across all public repos.
 */
async function fetchUserPullRequests(username) {
  const perPage = 100;
  let page = 1;
  let allPRs = [];

  while (true) {
    const url = `${GITHUB_API}/search/issues?q=author:${username}+type:pr&per_page=${perPage}&page=${page}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "gitly-app",
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    allPRs = allPRs.concat(data.items || []);

    if (allPRs.length >= data.total_count || data.items.length < perPage) {
      break;
    }
    page++;
  }

  return allPRs;
}

/**
 * Group pull requests by repository name.
 */
function groupPRsByRepo(prs) {
  const repoMap = {};
  for (const pr of prs) {
    const repoUrl = pr.repository_url || "";
    const repoName = repoUrl.split("/repos/")[1] || "unknown";
    repoMap[repoName] = (repoMap[repoName] || 0) + 1;
  }
  return repoMap;
}

/**
 * Fetch user profile info.
 */
async function fetchUserProfile(username) {
  const url = `${GITHUB_API}/users/${username}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "gitly-app",
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Fetch REAL contribution data by scraping GitHub's contribution page.
 * Works without authentication - gets the exact data GitHub displays.
 */
async function fetchContributionData(username) {
  const url = `https://github.com/users/${username}/contributions`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch contributions page: ${res.status}`);
  }

  const html = await res.text();
  return parseContributionHTML(html);
}

/**
 * Parse GitHub contributions HTML to extract real contribution data.
 *
 * GitHub's HTML structure:
 * <td data-date="2025-03-30" data-level="1"></td>
 * <tool-tip>7 contributions on March 30th.</tool-tip>
 *
 * We extract dates from td elements and counts from tool-tip elements,
 * then match them in order.
 */
function parseContributionHTML(html) {
  // Extract total contributions from the header text
  let totalContributions = 0;
  const totalMatch = html.match(
    /(\d[\d,]*)\s+contributions?\s+in\s+the\s+last\s+year/i
  );
  if (totalMatch) {
    totalContributions = parseInt(totalMatch[1].replace(/,/g, ""), 10);
  }

  // Extract day cells with stable ids, dates, and levels.
  const tdRegex = /<td\b[^>]*\bdata-date="\d{4}-\d{2}-\d{2}"[^>]*><\/td>/g;
  const dates = [];
  let match;
  while ((match = tdRegex.exec(html)) !== null) {
    const tag = match[0];
    const idMatch = tag.match(/\bid="([^"]+)"/);
    const dateMatch = tag.match(/\bdata-date="(\d{4}-\d{2}-\d{2})"/);
    const levelMatch = tag.match(/\bdata-level="(\d+)"/);
    if (!dateMatch || !levelMatch) continue;

    dates.push({
      id: idMatch ? idMatch[1] : `day-${dates.length}`,
      date: dateMatch[1],
      level: parseInt(levelMatch[1], 10),
    });
  }

  // Extract contribution counts from tooltips keyed by their target day cell id.
  // Formats include:
  // - "7 contributions on March 30th."
  // - "1 contribution on ..."
  // - "No contributions on ..."
  const tipRegex =
    /<tool-tip[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g;
  const countById = new Map();
  while ((match = tipRegex.exec(html)) !== null) {
    const targetId = match[1];
    const tipText = match[2].replace(/\s+/g, " ").trim();
    const countMatch = tipText.match(/(\d+)\s+contribution/i);
    const count = countMatch ? parseInt(countMatch[1], 10) : 0;
    countById.set(targetId, count);
  }

  // Build days array by id so each date receives its own exact count.
  const days = [];
  for (let i = 0; i < dates.length; i++) {
    const count = countById.has(dates[i].id) ? countById.get(dates[i].id) : 0;
    days.push({
      date: dates[i].date,
      count: count,
      level: dates[i].level,
    });
  }

  // If no tooltips found at all, estimate from level.
  if (countById.size === 0 && days.length > 0) {
    const levelEstimates = { 0: 0, 1: 2, 2: 5, 3: 8, 4: 15 };
    for (const day of days) {
      day.count = levelEstimates[day.level] || 0;
    }
  }

  // Sort by date
  days.sort((a, b) => a.date.localeCompare(b.date));

  // If total wasn't found, sum the days
  if (totalContributions === 0) {
    totalContributions = days.reduce((sum, d) => sum + d.count, 0);
  }

  return {
    totalContributions,
    days,
  };
}

module.exports = {
  fetchUserPullRequests,
  groupPRsByRepo,
  fetchUserProfile,
  fetchContributionData,
  fetchUserLanguages,
};

/**
 * Fetch language usage across user's public repos.
 * Aggregates language bytes from all repos.
 */
async function fetchUserLanguages(username) {
  let page = 1;
  const langMap = {};
  let totalBytes = 0;

  while (page <= 5) {
    const url = `${GITHUB_API}/users/${username}/repos?per_page=100&page=${page}&type=owner&sort=updated`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "gitly-app",
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!res.ok) break;

    const repos = await res.json();
    if (!repos.length) break;

    // Fetch language data for each repo (only fork=false to count unique repos)
    const promises = repos
      .filter((r) => !r.fork && r.size > 0)
      .slice(0, 30) // limit to 30 repos to avoid rate limits
      .map(async (repo) => {
        try {
          const langRes = await fetch(repo.languages_url, {
            headers: {
              "User-Agent": "gitly-app",
              Accept: "application/vnd.github.v3+json",
            },
          });
          if (langRes.ok) {
            return langRes.json();
          }
        } catch {}
        return {};
      });

    const results = await Promise.all(promises);

    for (const langs of results) {
      for (const [lang, bytes] of Object.entries(langs)) {
        langMap[lang] = (langMap[lang] || 0) + bytes;
        totalBytes += bytes;
      }
    }

    if (repos.length < 100) break;
    page++;
  }

  // Convert to array and calculate percentages
  let languages = Object.entries(langMap)
    .map(([name, bytes]) => ({
      name,
      bytes,
      rawPercentage: totalBytes > 0 ? ((bytes / totalBytes) * 100) : 0,
    }))
    .sort((a, b) => b.bytes - a.bytes);

  // Fix percentages to add up to 100%
  // Round each to 2 decimal places, ensure minimum 0.01%
  languages = languages.map((lang, idx) => {
    let pct = Math.round(lang.rawPercentage * 100) / 100;
    if (pct < 0.01 && lang.bytes > 0) pct = 0.01;
    return { name: lang.name, bytes: lang.bytes, percentage: pct };
  });

  // Adjust last item to make total exactly 100%
  const totalPct = languages.reduce((sum, l) => sum + l.percentage, 0);
  if (languages.length > 0 && Math.abs(totalPct - 100) > 0.01) {
    const diff = 100 - totalPct;
    languages[languages.length - 1].percentage += diff;
    languages[languages.length - 1].percentage = Math.round(languages[languages.length - 1].percentage * 100) / 100;
  }

  // Remove languages with 0 bytes
  languages = languages.filter(l => l.bytes > 0);

  return { languages, totalBytes };
}
