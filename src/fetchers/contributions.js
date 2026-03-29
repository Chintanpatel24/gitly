// @ts-check

import axios from "axios";
import * as dotenv from "dotenv";
import githubUsernameRegex from "github-username-regex";
import { logger } from "../common/log.js";
import { CustomError, MissingParamError } from "../common/error.js";

dotenv.config();

/**
 * Get current date in YYYY-MM-DD format.
 *
 * @returns {string} Current date.
 */
function getCurrentDate() {
  const date = new Date();
  return date.toISOString().split("T")[0];
}

/**
 * Get date from one year ago in YYYY-MM-DD format.
 *
 * @returns {string} Date one year ago.
 */
function getYearAgo() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date.toISOString().split("T")[0];
}

/**
 * Parse contribution data from GitHub profile page.
 *
 * @param {string} html HTML content of GitHub profile.
 * @returns {{contributions: Array<{date: string, count: number}>, maxCount: number, totalContributions: number}} Parsed contribution payload.
 */
function parseContributionData(html) {
  /** @type {Array<{date: string, count: number}>} */
  const contributions = [];
  let maxCount = 0;
  let totalContributions = 0;

  try {
    // Look for contribution data in the SVG rect elements
    // Pattern: data-date="YYYY-MM-DD" data-count="X"
    const contribRegex = /data-date="(\d{4}-\d{2}-\d{2})"\s+data-count="(\d+)"/g;
    let match;

    while ((match = contribRegex.exec(html)) !== null) {
      const date = match[1];
      const count = parseInt(match[2], 10);

      contributions.push({
        date,
        count,
      });

      totalContributions += count;
      if (count > maxCount) {
        maxCount = count;
      }
    }

    return {
      contributions: contributions.slice(-365), // Last year
      maxCount,
      totalContributions,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error("Error parsing contribution data:", message);
    return {
      contributions: [],
      maxCount: 0,
      totalContributions: 0,
    };
  }
}

/**
 * Returns Authorization header if a token exists, otherwise public access headers.
 *
 * @returns {Record<string, string>} Headers for GitHub request.
 */
function githubHeaders() {
  const token = process.env.GITHUB_TOKEN || process.env.PAT_1;
  /** @type {Record<string, string>} */
  const headers = {
    "User-Agent": "github-readme-cards",
    Accept: "text/html,application/xhtml+xml",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Fetch GitHub contribution data for a user.
 * Uses the contributions API to get daily commit counts.
 *
 * @param {string} username GitHub username.
 * @returns {Promise<{
 *  contributions: Array<{date: string, count: number}>,
 *  maxCount: number,
 *  totalContributions: number
 * }>} Contributions data.
 */
export const fetchContributions = async (username) => {
  if (!username) {
    throw new MissingParamError(["username"]);
  }

  if (!githubUsernameRegex.test(username)) {
    throw new CustomError("Invalid username", "Username validation failed");
  }

  try {
    // Use public GitHub contributions endpoint (optional token for higher limits).
    const response = await axios.get(
      `https://github.com/users/${username}/contributions?from=${getYearAgo()}&to=${getCurrentDate()}`,
      {
        headers: githubHeaders(),
      },
    );

    // Extract contribution data from the calendar SVG
    const contributionData = parseContributionData(response.data);

    return contributionData;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error("Error fetching contributions:", message);
    // Return empty data if we fail to fetch
    return {
      contributions: [],
      maxCount: 0,
      totalContributions: 0,
    };
  }
};


