export type Position = { x: number; y: number };

const MIN_DISTANCE = 120;
const CIRCLE_SIZE = 100;
const MAX_ATTEMPTS = 200;

export function generatePositions(
  count: number,
  areaWidth: number,
  areaHeight: number
): Position[] {
  const padding = CIRCLE_SIZE / 2 + 10;
  const positions: Position[] = [];

  for (let i = 0; i < count; i++) {
    let placed = false;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const x = padding + Math.random() * (areaWidth - padding * 2);
      const y = padding + Math.random() * (areaHeight - padding * 2);
      const tooClose = positions.some(
        (p) => Math.hypot(p.x - x, p.y - y) < MIN_DISTANCE
      );
      if (!tooClose) {
        positions.push({ x, y });
        placed = true;
        break;
      }
    }
    if (!placed) {
      // fallback: place in grid
      const cols = Math.ceil(Math.sqrt(count));
      const cellW = (areaWidth - padding * 2) / cols;
      const row = Math.floor(i / cols);
      const col = i % cols;
      positions.push({
        x: padding + col * cellW + cellW / 2 + (Math.random() - 0.5) * 20,
        y: padding + row * cellW + cellW / 2 + (Math.random() - 0.5) * 20,
      });
    }
  }
  return positions;
}
