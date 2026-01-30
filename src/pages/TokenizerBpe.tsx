import { useMemo, useState } from "react";
import { trainMiniBpe, tokenizeWithMiniBpe } from "../utils/tokenizerBpe";

const defaultCorpus = `りんごの色は赤です
ばななの色は黄色です
きういの色は緑です
りんごの色は何色ですか？`;

export default function MiniBpeDemo() {
  const [corpus, setCorpus] = useState(defaultCorpus);
  const [input, setInput] = useState("りんごの色は何色ですか？");
  const [merges, setMerges] = useState(30);

  const model = useMemo(
    () => trainMiniBpe(corpus, { merges, minPairCount: 2 }),
    [corpus, merges],
  );
  const tokens = useMemo(
    () => tokenizeWithMiniBpe(input, model),
    [input, model],
  );

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 900 }}>
      <h2>ミニトークナイザ ver.BPE</h2>

      <label>
        学習コーパス：
        <textarea
          value={corpus}
          onChange={(e) => setCorpus(e.target.value)}
          rows={5}
          style={{ width: "100%" }}
        />
      </label>

      <div style={{ marginTop: 12 }}>
        merges回数：
        <input
          type="number"
          value={merges}
          onChange={(e) => setMerges(Number(e.target.value))}
          style={{ width: 80, marginLeft: 8 }}
        />
      </div>

      <label style={{ display: "block", marginTop: 12 }}>
        入力文：
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: "100%" }}
        />
      </label>

      <div style={{ marginTop: 12 }}>
        <strong>トークン結果：</strong>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}
        >
          {tokens.map((t, idx) => (
            <span
              key={`${t}-${idx}`}
              style={{
                border: "1px solid #ccc",
                padding: "4px 8px",
                borderRadius: 6,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <details style={{ marginTop: 12 }}>
        <summary>学習された結合ルール（merges）</summary>
        <pre style={{ fontSize: 12 }}>
          {JSON.stringify(model.merges, null, 2)}
        </pre>
      </details>
    </div>
  );
}
