export function getHeatVisual(heat: number) {
  const height = 36 + heat * 1.35;
  const glowColor =
    heat > 72 ? "#ff784a" : heat > 38 ? "#ffb36b" : "#6fd3ff";
  const opacity = Math.min(0.95, 0.28 + heat / 120);

  return {
    height,
    glowColor,
    opacity,
  };
}
