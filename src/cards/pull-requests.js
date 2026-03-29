// @ts-check

import { Card } from "../common/Card.js";
import { getCardColors } from "../common/color.js";

const CARD_MIN_WIDTH = 300;
const CARD_DEFAULT_WIDTH = 400;

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

  // Calculate height dynamically based on number of repositories
  const repoCount = Object.keys(prData.prsByRepository).length;
  const baseHeight = 120;
  const perRepoHeight = 40;
  const height = baseHeight + Math.min(repoCount, 8) * perRepoHeight;

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

  // Create PR content
  let contentY = 60;
  let prContent = `
    <text
      x="25"
      y="${contentY}"
      class="header"
      data-testid="header"
      style="font-size: 14px; font-weight: 600;"
    >
      Total Pull Requests: ${prData.totalCount}
    </text>
  `;

  contentY += 30;

  // List repositories with PR counts
  const repos = Object.entries(prData.prsByRepository).slice(0, 8);
  repos.forEach(([repoName, prs]) => {
    const prCount = prs.length;
    const repoLabel = repoName.split("/")[1] || repoName;
    const pluralSuffix = prCount === 1 ? "" : "s";

    prContent += `
      <g>
        <text
          x="25"
          y="${contentY}"
          class="stat-label"
          style="font-size: 12px; fill: ${colors.textColor};"
        >
          ${repoLabel}
        </text>
        <text
          x="${width - 25}"
          y="${contentY}"
          class="stat-value"
          text-anchor="end"
          style="font-size: 12px; font-weight: 600; fill: ${colors.titleColor};"
        >
          ${prCount} PR${pluralSuffix}
        </text>
      </g>
    `;

    contentY += 35;
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

    .header,
    .stat-label,
    .stat-value {
      animation: slideInUp 0.3s ease-out forwards;
    }

    .stat-label {
      animation-delay: 0.1s;
    }

    .stat-value {
      animation-delay: 0.15s;
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
          y="35"
          class="header"
          style="font-size: 18px; font-weight: 700; fill: ${colors.titleColor};"
        >
          ${card.title}
        </text>
      </g>

      <!-- Content -->
      ${prContent}
    </svg>
  `;

  return finalSVG;
};
