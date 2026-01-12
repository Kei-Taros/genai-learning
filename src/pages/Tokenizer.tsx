import { useMemo, useState } from "react";
import { miniTokenize } from "../utils/tokenizer";
import { DEFAULT_DICT } from "../assets/tokenizerDict";

export default function Tokenizer() {
  const [input, setInput] = useState("りんごの色は何色ですか？");
  const [dictInput, setDictInput] = useState("");

  const BASE_DICT = ["、", ","];
  const dict = useMemo(() => {
    const trimmed = dictInput.trim();
    if (!trimmed) {
      return Array.from(new Set([...DEFAULT_DICT, ...BASE_DICT]));
    }

    const items = trimmed
      .split(/[、,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const mergedDict = [...items, ...BASE_DICT];

    const unique = Array.from(new Set(mergedDict));
    return unique.length ? unique : [...DEFAULT_DICT, ...BASE_DICT];
  }, [dictInput]);

  const tokens = useMemo(() => miniTokenize(input, dict), [input, dict]);

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 900 }}>
      <h2>ミニトークナイザ</h2>

      <div style={{ display: "grid", gap: 12 }}>
        <label>
          入力文：
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ width: "100%" }}
          />
        </label>

        <label>
          辞書登録（[,][、] 区切り）：
          <input
            value={dictInput}
            onChange={(e) => setDictInput(e.target.value)}
            placeholder="例: りんご,ごりら,らっぱ"
            style={{ width: "100%" }}
          />
        </label>

        <div>
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
                  background: "#000000ff",
                  color: "#fff",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        {/* 👇 デバッグ情報 */}
        <details>
          <summary>デバッグ情報（辞書 / DEFAULT_DICT）</summary>
          <pre style={{ fontSize: "12px" }}>
            {JSON.stringify(
              {
                DEFAULT_DICT,
              },
              null,
              2
            )}
          </pre>
        </details>
      </div>
    </div>
  );
}
