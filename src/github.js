/**
 * GitHub API helpers for fetching user data (no auth required).
 */

const GITHUB_API = "https://api.github.com";

/**
 * Fetch all pull requests by a user across all public repos.
 * Uses GitHub search API (unauthenticated, 10 req/min).
 * @param {string} username
 * @returns {Promise<Array>}
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
 * @param {Array} prs
 * @returns {Object} { repoName: count }
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
 * @param {string} username
 * @returns {Promise<Object>}
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
 * Fetch contribution data from GitHub's contribution calendar.
 * This scrapes the user's public contributions page.
 * @param {string} username
 * @returns {Promise<Object>} { totalContributions, days: [{ date, count }] }
 */
async function fetchContributionData(username) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "gitly-app",
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  });

  if (!res.ok) {
    // GraphQL requires auth, fallback to REST scraping
    return fetchContributionDataFallback(username);
  }

  const data = await res.json();
  if (data.errors) {
    return fetchContributionDataFallback(username);
  }

  const calendar = data.data.user.contributionsCollection.contributionCalendar;
  const days = [];
  for (const week of calendar.weeks) {
    for (const day of week.contributionDays) {
      days.push({
        date: day.date,
        count: day.contributionCount,
      });
    }
  }

  return {
    totalContributions: calendar.totalContributions,
    days,
  };
}

/**
 * Fallback: fetch contribution events via REST API (public, no auth needed).
 * Gets last year of activity from public events.
 * @param {string} username
 * @returns {Promise<Object>}
 */
async function fetchContributionDataFallback(username) {
  const dayMap = {};
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // Initialize all days with 0
  for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    dayMap[dateStr] = 0;
  }

  // Fetch public events (paginated, up to 3 pages = 90 events)
  for (let page = 1; page <= 3; page++) {
    try {
      const url = `${GITHUB_API}/users/${username}/events/public?per_page=30&page=${page}`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "gitly-app",
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!res.ok) break;

      const events = await res.json();
      if (!events.length) break;

      for (const event of events) {
        const date = event.created_at ? event.created_at.split("T")[0] : null;
        if (date && dayMap.hasOwnProperty(date)) {
          dayMap[date]++;
        }
      }
    } catch {
      break;
    }
  }

  const days = Object.entries(dayMap).map(([date, count]) => ({ date, count }));
  const totalContributions = days.reduce((sum, d) => sum + d.count, 0);

  return { totalContributions, days };
}

module.exports = {
  fetchUserPullRequests,
  groupPRsByRepo,
  fetchUserProfile,
  fetchContributionData,
  fetchContributionDataFallback,
};
