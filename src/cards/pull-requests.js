// @ts-check

import { Card } from "../common/Card.js";
import { getCardColors } from "../common/color.js";

const CARD_MIN_WIDTH = 300;
const CARD_DEFAULT_WIDTH = 620;

/**
 * Render pull requests card.
 *
 * @param {object} prData Pull requests data.
 * @param {number} prData.totalCount Total number of pull requests.
 * @param {object} prData.prsByRepository Pull requests grouped by repository.
 * @param {object} options Card options.
 * @param {string=} options.title_color Title color.
 * @param {string=} options.text_color Text color.
 * @param {string=} options.bg_color Background color.
 * @param {string=} options.border_color Border color.
 * @param {string=} options.theme Theme name.
 * @param {boolean=} options.hide_border Hide border.
 * @param {number=} options.card_width Card width.
 * @param {number=} options.border_radius Border radius.
 * @param {boolean=} options.disable_animations Disable animations.
 * @param {string=} options.custom_title Custom title.
 * @returns {string} Rendered card SVG.
 */
export const renderPRCard = (prData, options = {}) => {
  const {
    title_color,
    text_color,
    bg_color,
    border_color,
    theme,
    hide_border = false,
    card_width = CARD_DEFAULT_WIDTH,
    border_radius,
    disable_animations = false,
    custom_title,
  } = options;

  const colors = getCardColors({
    title_color,
    text_color,
    bg_color,
    border_color,
    theme,
  });

  const width = Math.max(card_width, CARD_MIN_WIDTH);

  const repoRows = Math.min(Object.keys(prData.prsByRepository).length, 6);
  const height = 190 + repoRows * 28;

  const card = new Card({
    width,
    height,
    border_radius,
    colors,
    customTitle: custom_title,
    defaultTitle: "Pull Requests",
  });

  card.setHideBorder(hide_border);
  if (disable_animations) {
    card.disableAnimations();
  }

  const allPrs = Object.values(prData.prsByRepository).flat();
  const mergedCount = allPrs.filter((pr) => pr.merged).length;
  const openCount = allPrs.filter((pr) => pr.state === "open").length;
  const closedCount = prData.totalCount - openCount;
  const repoCount = Object.keys(prData.prsByRepository).length;

  const repos = Object.entries(prData.prsByRepository)
    .map(([repoName, prs]) => ({
      repoName,
      shortName: repoName.split("/")[1] || repoName,
      count: prs.length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const maxRepoCount = repos.length ? repos[0].count : 1;
  const barStartX = 220;
  const barMaxWidth = width - barStartX - 85;
  let graphY = 174;

  let graphSvg = "";
  repos.forEach((repo, index) => {
    const barWidth = Math.max(6, Math.round((repo.count / maxRepoCount) * barMaxWidth));
    const delay = 300 + index * 90;
    graphSvg += `
      <g>
        <text
          x="25"
          y="${graphY + 10}"
          style="font-size: 11px; fill: ${colors.textColor};"
        >
          ${repo.shortName}
        </text>
        <rect
          x="${barStartX}"
          y="${graphY}"
          width="${barWidth}"
          height="14"
          rx="7"
          class="graph-bar"
          style="fill: ${colors.titleColor}; animation-delay: ${delay}ms;"
        />
        <text
          x="${barStartX + barWidth + 8}"
          y="${graphY + 11}"
          style="font-size: 11px; font-weight: 600; fill: ${colors.textColor};"
        >
          ${repo.count}
        </text>
      </g>
    `;
    graphY += 24;
  });

  const animationCSS = `
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0px);
      }
    }

    @keyframes expandBar {
      from {
        width: 0;
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .header,
    .meta-number,
    .meta-label {
      animation: slideInUp 0.3s ease-out forwards;
    }

    .meta-label {
      animation-delay: 0.1s;
    }

    .meta-number {
      animation-delay: 0.15s;
    }

    .graph-bar {
      transform-origin: left center;
      animation: expandBar 0.45s ease-out forwards;
    }
  `;

  const finalSVG = `
    <svg
      width="${width}"
      height="${height}"
      viewBox="0 0 ${width} ${height}"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        ${animationCSS}
      </style>

      <!-- Background -->
      <rect
        width="${width}"
        height="${height}"
        rx="${border_radius || 4.5}"
        fill="${colors.bgColor}"
        stroke="${colors.borderColor}"
        stroke-width="${hide_border ? 0 : 1}"
      />

      <!-- Title -->
      <g>
        <text
          x="25"
          y="34"
          class="header"
          style="font-size: 18px; font-weight: 700; fill: ${colors.titleColor};"
        >
          ${card.title}
        </text>
      </g>

      <text x="25" y="56" style="font-size: 12px; fill: ${colors.textColor}; opacity: 0.75;">
        Graph + Numbers (Top repositories by PR count)
      </text>

      <g>
        <rect x="25" y="72" width="130" height="72" rx="10" fill="${colors.titleColor}" fill-opacity="0.12" />
        <text x="40" y="94" class="meta-label" style="font-size: 11px; fill: ${colors.textColor};">Total PRs</text>
        <text x="40" y="122" class="meta-number" style="font-size: 26px; font-weight: 700; fill: ${colors.titleColor};">${prData.totalCount}</text>
      </g>

      <g>
        <text x="178" y="92" class="meta-label" style="font-size: 11px; fill: ${colors.textColor};">Merged</text>
        <text x="178" y="110" class="meta-number" style="font-size: 15px; font-weight: 700; fill: #3fb950;">${mergedCount}</text>

        <text x="252" y="92" class="meta-label" style="font-size: 11px; fill: ${colors.textColor};">Open</text>
        <text x="252" y="110" class="meta-number" style="font-size: 15px; font-weight: 700; fill: #58a6ff;">${openCount}</text>

        <text x="317" y="92" class="meta-label" style="font-size: 11px; fill: ${colors.textColor};">Closed</text>
        <text x="317" y="110" class="meta-number" style="font-size: 15px; font-weight: 700; fill: ${colors.textColor};">${closedCount}</text>

        <text x="392" y="92" class="meta-label" style="font-size: 11px; fill: ${colors.textColor};">Repositories</text>
        <text x="392" y="110" class="meta-number" style="font-size: 15px; font-weight: 700; fill: ${colors.textColor};">${repoCount}</text>
      </g>

      <text x="25" y="160" style="font-size: 12px; font-weight: 600; fill: ${colors.titleColor};">Top Repositories</text>

      ${graphSvg}
    </svg>
  `;

  return finalSVG;
};
