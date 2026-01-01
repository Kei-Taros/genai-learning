import { useState, useEffect, useRef } from "react";
import EmbeddingChart from "../components/EmbeddingChart";
import { colorEmbeddings } from "../assets/embedding";
import { colorLabelMap, fruitLabelMap } from "../assets/labelMap";
import {
  predictColor,
  trainOnce,
  createRandomFruitEmbeddings,
  type Vec2,
} from "../utils/logic";

const FruitAiPage = () => {
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

  const handleTrainReset = () => {
    if (trainTimerRef.current !== null) {
      window.clearInterval(trainTimerRef.current);
      trainTimerRef.current = null;
    }

    setIsTraining(false);
    setFruitEmbeddings(createRandomFruitEmbeddings());
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

        <button
          onClick={handleTrainReset}
          style={{ marginLeft: "12px", padding: "4px 12px" }}
          disabled={isTraining}
        >
          学習をリセット
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

export default FruitAiPage;
