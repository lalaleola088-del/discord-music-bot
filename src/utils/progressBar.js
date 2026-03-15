module.exports = function progressBar(current, total, size = 16) {
  if (!total || total <= 0) return "────────────";

  const progress = Math.min(current / total, 1);
  const filled = Math.round(size * progress);
  const empty = size - filled;

  return "▰".repeat(filled) + "▱".repeat(empty);
};
