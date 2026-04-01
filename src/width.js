/**
 * Parse and clamp user-provided card width.
 */

function parseCardWidth(value, fallback = 460, min = 320, max = 1600) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(min, Math.min(max, parsed));
}

module.exports = { parseCardWidth };