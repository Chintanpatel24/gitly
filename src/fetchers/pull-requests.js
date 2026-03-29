// @ts-check

import axios from "axios";
import * as dotenv from "dotenv";
import githubUsernameRegex from "github-username-regex";
import { logger } from "../common/log.js";
import { CustomError, MissingParamError } from "../common/error.js";

dotenv.config();

const MAX_SEARCH_ITEMS = 1000;
const PER_PAGE = 100;
const MAX_PAGES = Math.ceil(MAX_SEARCH_ITEMS / PER_PAGE);

/**
 * Returns Authorization header if a token exists, otherwise public access headers.
 *
 * @returns {Record<string, string>} Headers for GitHub API request.
 */
const githubHeaders = () => {
  const token = process.env.GITHUB_TOKEN || process.env.PAT_1;
  /** @type {Record<string, string>} */
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "github-readme-cards",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Fetch pull requests for a given username.
 *
 * @param {string} username GitHub username.
 * @returns {Promise<{
 *  totalCount: number,
 *  prsByRepository: Record<string, Array<{number: number, title: string, state: string, createdAt: string}>>
 * }>} Pull requests data.
 */
export const fetchPullRequests = async (username) => {
  if (!username) {
    throw new MissingParamError(["username"]);
  }

  if (!githubUsernameRegex.test(username)) {
    throw new CustomError("Invalid username", "Username validation failed");
  }

  try {
    const query = `author:${username} type:pr`;

    let page = 1;
    let totalCount = 0;
    const allItems = [];

    while (page <= MAX_PAGES) {
      const response = await axios.get("https://api.github.com/search/issues", {
        headers: githubHeaders(),
        params: {
          q: query,
          sort: "created",
          order: "desc",
          per_page: PER_PAGE,
          page,
        },
      });

      const payload = response.data;
      if (!payload || !Array.isArray(payload.items)) {
        throw new CustomError(
          "Unexpected response structure",
          "Failed to fetch pull requests",
        );
      }

      totalCount = payload.total_count || 0;
      allItems.push(...payload.items);

      if (payload.items.length < PER_PAGE || allItems.length >= MAX_SEARCH_ITEMS) {
        break;
      }

      page += 1;
    }

    /** @type {Record<string, Array<{number: number, title: string, state: string, createdAt: string}>>} */
    const prsByRepo = {};

    allItems.forEach((item) => {
      const repositoryUrl = item.repository_url || "";
      const repoName = repositoryUrl.replace("https://api.github.com/repos/", "");

      if (!repoName) {
        return;
      }

      if (!prsByRepo[repoName]) {
        prsByRepo[repoName] = [];
      }

      prsByRepo[repoName].push({
        number: item.number,
        title: item.title,
        state: item.state,
        createdAt: item.created_at,
      });
    });

    return {
      totalCount: Math.min(totalCount, MAX_SEARCH_ITEMS),
      prsByRepository: prsByRepo,
    };
  } catch (err) {
    /** @type {any} */
    const error = err;
    const message = error?.response?.data?.message || error?.message;
    logger.error("Error fetching pull requests:", message);
    throw new CustomError("Failed to fetch pull requests", message);
  }
};
