import React from "react";
import { colorEmbeddings } from "../assets/embedding";
import { colorLabelMap } from "../assets/labelMap";

type Vec2 = [number, number];

type EmbeddingChartProps = {
  fruitEmbeddings?: Record<string, Vec2>;
  fruitLabelMap?: Record<string, string>;
};

const EmbeddingChart: React.FC<EmbeddingChartProps> = ({
  fruitEmbeddings,
  fruitLabelMap,
}) => {
  const width = 800;
  const height = 800;
  const padding = 100;

  const centerX = width / 2;
  const centerY = height / 2;

  // [-1,1] の座標を SVG 上の座標に変換する
  const toSvg = ([x, y]: Vec2) => {
    const svgX = centerX + x * (width / 2 - padding);
    const svgY = centerY - y * (height / 2 - padding); // y反転
    return { x: svgX, y: svgY };
  };

  return (
    <svg
      width={width}
      height={height}
      style={{ border: "1px solid #ccc", background: "#fafafa" }}
    >
      {/* x軸 */}
      <line
        x1={padding}
        y1={centerY}
        x2={width - padding}
        y2={centerY}
        stroke="#999"
      />
      {/* y軸 */}
      <line
        x1={centerX}
        y1={padding}
        x2={centerX}
        y2={height - padding}
        stroke="#999"
      />

      {/* 原点ラベル */}
      <text x={centerX + 4} y={centerY - 4} fontSize={10}>
        (0,0)
      </text>

      {/* 軸の端ラベル */}
      <text x={width - padding} y={centerY - 4} fontSize={10} textAnchor="end">
        x = 1
      </text>
      <text x={padding} y={centerY - 4} fontSize={10}>
        x = -1
      </text>
      <text x={centerX + 4} y={padding + 10} fontSize={10}>
        y = 1
      </text>
      <text x={centerX + 4} y={height - padding} fontSize={10}>
        y = -1
      </text>

      {/* 色ごとの点（赤/青/黄/緑） */}
      {Object.entries(colorEmbeddings).map(([colorKey, vec]) => {
        const { x, y } = toSvg(vec);

        const displayLabel = colorLabelMap[colorKey] ?? colorKey;

        const fill =
          colorKey === "red"
            ? "red"
            : colorKey === "blue"
            ? "blue"
            : colorKey === "yellow"
            ? "gold"
            : "green";

        return (
          <g key={colorKey}>
            <circle cx={x} cy={y} r={8} fill={fill} />
            <text
              x={x + 10}
              y={y - 10}
              fontSize={12}
              stroke="#fff"
              strokeWidth={3}
            >
              {displayLabel}
            </text>
            <text x={x + 5} y={y - 10} fontSize={12} fill="#000">
              {displayLabel}
            </text>
          </g>
        );
      })}

      {/* フルーツの点を描画（あれば） */}
      {fruitEmbeddings &&
        Object.entries(fruitEmbeddings).map(([fruitKey, vec]) => {
          const { x, y } = toSvg(vec);
          const [ex, ey] = vec;

          const displayLabel = fruitLabelMap?.[fruitKey] ?? fruitKey;
          const coordText = `[${ex.toFixed(2)}, ${ey.toFixed(2)}]`;

          return (
            <g key={fruitKey}>
              <circle
                cx={x}
                cy={y}
                r={6}
                fill="#fff"
                stroke="#333"
                strokeWidth={2}
              />
              <text
                x={x + 10}
                y={y + 10}
                fontSize={12}
                stroke="#fff"
                strokeWidth={3}
              >
                <tspan x={x + 10} dy="0">
                  {displayLabel}
                </tspan>
                <tspan x={x + 10} dy="14">
                  {coordText}
                </tspan>
              </text>
              <text x={x + 10} y={y + 10} fontSize={12} fill="#333">
                <tspan x={x + 10} dy="0">
                  {displayLabel}
                </tspan>
                <tspan x={x + 10} dy="14">
                  {coordText}
                </tspan>
              </text>
            </g>
          );
        })}
    </svg>
  );
};

export default EmbeddingChart;
