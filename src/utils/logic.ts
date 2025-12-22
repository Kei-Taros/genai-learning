import { colorEmbeddings, fruitTargetColor } from "../assets/embedding";

export type Vec2 = [number, number];

const distance = (a: Vec2, b: Vec2): number => {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
};

// 「AI」が果物の色を推論する関数
export const predictColor = (
  fruit: string,
  fruitEmbeddings: Record<string, Vec2>
): string | null => {
  const fruitVec = fruitEmbeddings[fruit];
  if (!fruitVec) return null;

  let bestColor: string | null = null;
  let bestDist = Infinity;

  for (const [color, colorVec] of Object.entries(colorEmbeddings)) {
    const d = distance(fruitVec, colorVec);
    if (d < bestDist) {
      bestDist = d;
      bestColor = color;
    }
  }

  return bestColor;
};

const moveTowards = (current: number, target: number, step = 0.1): number => {
  const diff = target - current;
  if (Math.abs(diff) <= step) return target;
  return current + Math.sign(diff) * step;
};

export const trainOnce = (
  embeddings: Record<string, Vec2>,
  step = 0.1
): Record<string, Vec2> => {
  const next: Record<string, Vec2> = {};

  for (const [fruitKey, vec] of Object.entries(embeddings)) {
    const targetColor = fruitTargetColor[fruitKey];
    if (!targetColor) {
      next[fruitKey] = vec;
      continue;
    }

    const target = colorEmbeddings[targetColor];
    const [x, y] = vec;
    const [tx, ty] = target;

    next[fruitKey] = [moveTowards(x, tx, step), moveTowards(y, ty, step)];
  }

  return next;
};

const rand = (): number => Math.random() * 1.98 - 0.99;
export const createRandomFruitEmbeddings = (): Record<string, Vec2> => ({
  apple: [rand(), rand()],
  strawberry: [rand(), rand()],
  banana: [rand(), rand()],
  kiwi: [rand(), rand()],
});
