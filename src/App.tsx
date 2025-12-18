import { useState, useEffect, useRef } from "react";
import EmbeddingChart from "./components/EmbeddingChart";
import { colorEmbeddings, fruitTargetColor } from "./assets/embedding";
import { colorLabelMap, fruitLabelMap } from "./assets/labelMap";

type Vec2 = [number, number];

const rand = (): number => Math.random() * 1.98 - 0.99;

// ユークリッド距離
const distance = (a: Vec2, b: Vec2): number => {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
};

// 「AI」が果物の色を推論する関数
const predictColor = (
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

const trainOnce = (
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

const createRandomFruitEmbeddings = (): Record<string, Vec2> => ({
  apple: [rand(), rand()],
  strawberry: [rand(), rand()],
  banana: [rand(), rand()],
  kiwi: [rand(), rand()],
});

const App = () => {
  const [fruitEmbeddings, setFruitEmbeddings] = useState<Record<string, Vec2>>({
    apple: [0, 0],
    strawberry: [0, 0],
    banana: [0, 0],
    kiwi: [0, 0],
  });

  const [isTraining, setIsTraining] = useState(false);
  const trainTimerRef = useRef<number | null>(null);
  const [selectedFruit, setSelectedFruit] = useState<string>("apple");
  const [answer, setAnswer] = useState<string | null>(null);

  const handlePredict = () => {
    const result = predictColor(selectedFruit, fruitEmbeddings);
    if (!result) return;

    const japaneseColor = colorLabelMap[result] ?? result;
    setAnswer(japaneseColor);
  };

  const handleTrain = () => {
    if (isTraining) return;

    setIsTraining(true);

    let count = 0;

    trainTimerRef.current = window.setInterval(() => {
      setFruitEmbeddings((prev) => trainOnce(prev, 0.1));

      count += 1;
      if (count >= 3) {
        if (trainTimerRef.current !== null) {
          window.clearInterval(trainTimerRef.current);
          trainTimerRef.current = null;
        }
        setIsTraining(false);
      }
    }, 200); // 実行間隔を設定
  };

  useEffect(() => {
    setFruitEmbeddings(createRandomFruitEmbeddings());

    return () => {
      if (trainTimerRef.current !== null) {
        window.clearInterval(trainTimerRef.current);
        trainTimerRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h1>果物の色を答える ミニ生成AI</h1>

      <label>
        果物を選択：
        <select
          value={selectedFruit}
          onChange={(e) => setSelectedFruit(e.target.value)}
          style={{ marginLeft: "8px" }}
        >
          {Object.keys(fruitEmbeddings).map((fruitKey) => (
            <option key={fruitKey} value={fruitKey}>
              {fruitLabelMap[fruitKey] ?? fruitKey}
            </option>
          ))}
        </select>
      </label>

      <button
        onClick={handlePredict}
        style={{ marginLeft: "12px", padding: "4px 12px" }}
      >
        AIに聞く
      </button>

      <div>
        <button
          onClick={handleTrain}
          disabled={isTraining}
          style={{ marginLeft: "12px", padding: "4px 12px" }}
        >
          {isTraining ? "学習中..." : "学習する"}
        </button>
      </div>

      <div style={{ marginTop: "16px" }}>
        <div>
          <strong>質問：</strong>
          {fruitLabelMap[selectedFruit]} の色は何色ですか？
        </div>
        <div>
          <strong>AIの答え：</strong>
          {answer}
        </div>
      </div>

      <hr style={{ margin: "24px 0" }} />

      <details>
        <summary>デバッグ情報（Embedding）</summary>
        <pre style={{ fontSize: "12px" }}>
          {JSON.stringify(
            {
              fruitEmbeddings,
              colorEmbeddings,
            },
            null,
            2
          )}
        </pre>
      </details>
      <br />
      <EmbeddingChart
        fruitEmbeddings={fruitEmbeddings}
        fruitLabelMap={fruitLabelMap}
      />
    </div>
  );
};

export default App;
