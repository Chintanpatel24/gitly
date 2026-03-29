// @ts-check

import { Card } from "../common/Card.js";
import { getCardColors } from "../common/color.js";

const CARD_MIN_WIDTH = 300;
const CARD_DEFAULT_WIDTH = 850;

/**
 * Get green color intensity based on contribution count.
 * Using GitHub dark theme green colors.
 *
 * @param {number} count Contribution count.
 * @param {number} maxCount Maximum contribution count.
 * @returns {string} Color in hex format.
 */
function getContributionColor(count, maxCount) {
  if (count === 0) {
    return "#0d1117"; // Very dark (almost background)
  }

  // GitHub dark theme green scale
  const greenShades = [
    "#0d1117", // None
    "#0e3d1a", // 1-3
    "#1d6d2a", // 4-9
    "#27a82f", // 10-19
    "#3aed5d", // 20+
  ];

  const percentage = count / maxCount;

  if (percentage === 0) {
    return greenShades[0];
  }
  if (percentage < 0.25) {
    return greenShades[1];
  }
  if (percentage < 0.5) {
    return greenShades[2];
  }
  if (percentage < 0.75) {
    return greenShades[3];
  }
  return greenShades[4];
}

/**
 * Render contributions card with daily contribution numbers.
 *
 * @param {object} contribData Contributions data.
 * @param {Array} contribData.contributions Array of daily contributions.
 * @param {number} contribData.maxCount Maximum contributions in a day.
 * @param {number} contribData.totalContributions Total contributions.
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
export const renderContributionsCard = (contribData, options = {}) => {
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
  const height = 220;

  const card = new Card({
    width,
    height,
    border_radius,
    colors,
    customTitle: custom_title,
    defaultTitle: "Contributions",
  });

  card.setHideBorder(hide_border);
  if (disable_animations) {
    card.disableAnimations();
  }

  const { contributions, maxCount, totalContributions } = contribData;

  // Calculate grid layout for contribution squares
  const squareSize = 12;
  const squareSpacing = 2;
  const weeksToShow = 52;

  let contributionSVG = ``;

  // Create 52-week grid (7 days per week)
  let xPos = 25;
  let yPos = 80;
  let dayOfWeek = 0;
  let weekIndex = 0;

  for (
    let i = Math.max(0, contributions.length - 365);
    i < contributions.length;
    i++
  ) {
    const contrib = contributions[i];
    const color = getContributionColor(contrib.count, maxCount);

    // Create a tooltip for each square
    const contributionSuffix = contrib.count === 1 ? "" : "s";
    const tooltipText = `${contrib.date}: ${contrib.count} contribution${contributionSuffix}`;

    contributionSVG += `
      <g>
        <rect
          x="${xPos}"
          y="${yPos}"
          width="${squareSize}"
          height="${squareSize}"
          rx="1"
          fill="${color}"
          stroke="${colors.borderColor}"
          stroke-width="0.5"
          class="contrib-square"
        />
        <title>${tooltipText}</title>
        <text
          x="${xPos + squareSize / 2}"
          y="${yPos + squareSize / 2 + 3}"
          text-anchor="middle"
          style="font-size: 8px; font-weight: 600; fill: white; pointer-events: none;"
        >
          ${contrib.count > 0 ? contrib.count : ""}
        </text>
      </g>
    `;

    dayOfWeek++;

    if (dayOfWeek === 7) {
      // Move to next week
      dayOfWeek = 0;
      weekIndex++;
      xPos += squareSize + squareSpacing;
      yPos = 80;

      // Check if we've displayed enough weeks
      if (weekIndex >= weeksToShow) {
        break;
      }
    } else {
      yPos += squareSize + squareSpacing;
    }
  }

  const animationCSS = `
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .contrib-square {
      animation: fadeIn 0.3s ease-out forwards;
    }

    .contrib-square:hover {
      filter: brightness(1.2);
      stroke-width: 1;
    }
  `;

  const detailsY = 160;

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
      <text
        x="25"
        y="35"
        class="card-title"
        style="font-size: 18px; font-weight: 700; fill: ${colors.titleColor};"
      >
        ${card.title}
      </text>

      <!-- Subtitle -->
      <text
        x="25"
        y="50"
        class="card-subtitle"
        style="font-size: 12px; fill: ${colors.textColor}; opacity: 0.7;"
      >
        Last Year Contributions
      </text>

      <!-- Contribution grid -->
      ${contributionSVG}

      <!-- Stats footer -->
      <g>
        <text
          x="25"
          y="${detailsY}"
          style="font-size: 12px; font-weight: 600; fill: ${colors.titleColor};"
        >
          Total: ${totalContributions} contributions
        </text>
        <text
          x="25"
          y="${detailsY + 18}"
          style="font-size: 11px; fill: ${colors.textColor}; opacity: 0.7;"
        >
          Max in a day: ${maxCount} contributions
        </text>
      </g>

      <!-- Legend -->
      <g>
        <text
          x="${width - 200}"
          y="${detailsY}"
          style="font-size: 10px; fill: ${colors.textColor}; opacity: 0.6;"
        >
          Less
        </text>
        <rect x="${width - 160}" y="${detailsY - 8}" width="8" height="8" fill="#0d1117" stroke="${colors.borderColor}" stroke-width="0.5" />
        <rect x="${width - 150}" y="${detailsY - 8}" width="8" height="8" fill="#0e3d1a" stroke="${colors.borderColor}" stroke-width="0.5" />
        <rect x="${width - 140}" y="${detailsY - 8}" width="8" height="8" fill="#1d6d2a" stroke="${colors.borderColor}" stroke-width="0.5" />
        <rect x="${width - 130}" y="${detailsY - 8}" width="8" height="8" fill="#27a82f" stroke="${colors.borderColor}" stroke-width="0.5" />
        <rect x="${width - 120}" y="${detailsY - 8}" width="8" height="8" fill="#3aed5d" stroke="${colors.borderColor}" stroke-width="0.5" />
        <text
          x="${width - 108}"
          y="${detailsY}"
          style="font-size: 10px; fill: ${colors.textColor}; opacity: 0.6;"
        >
          More
        </text>
      </g>
    </svg>
  `;

  return finalSVG;
};
