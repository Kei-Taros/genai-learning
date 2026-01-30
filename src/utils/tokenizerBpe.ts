export type BpeModel = {
  merges: Array<[string, string]>;
};

const toChars = (s: string) => Array.from(s);

/*
tokens の中で最も頻出の隣接ペアを数える
0: {"りん" => 2}
1: {"んご" => 2}
2: {"ごの" => 2}
3: {"の色" => 4}
4: {"色は" => 4}
5: {"は赤" => 1}
 */
const countPairs = (words: string[][]) => {
  const counts = new Map<string, number>();
  for (const w of words) {
    for (let i = 0; i < w.length - 1; i++) {
      const key = `${w[i]}\u0001${w[i + 1]}`; // 区切りにレア文字を使う
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
};

const mergePairInWords = (words: string[][], a: string, b: string) => {
  const mergedToken = a + b;
  return words.map((w) => {
    const out: string[] = [];
    for (let i = 0; i < w.length; i++) {
      if (i < w.length - 1 && w[i] === a && w[i + 1] === b) {
        out.push(mergedToken);
        i++;
      } else {
        out.push(w[i]);
      }
    }
    return out;
  });
};

export const trainMiniBpe = (
  corpus: string,
  opts?: { merges?: number; minPairCount?: number },
): BpeModel => {
  const merges = opts?.merges ?? 30;
  // mergesの値を大きくすることで長いトークンを作ることが可能
  // ただし、頻出する文字のペアがなくなれば止まる
  const minPairCount = opts?.minPairCount ?? 2;

  // corpusを1行毎にして配列化
  const rawWords = corpus.split(/\s+/).filter(Boolean);

  // 1行になった文章を一文字ずつに分解
  // ['り', 'ん', 'ご', 'の', '色', 'は', '赤', 'で', 'す']
  let words = rawWords.map((w) => toChars(w));

  const mergeRules: Array<[string, string]> = [];

  for (let step = 0; step < merges; step++) {
    const pairCounts = countPairs(words);

    // 最頻出ペアを探す
    let bestKey: string | null = null;
    let bestCount = 0;
    for (const [k, c] of pairCounts.entries()) {
      if (c > bestCount) {
        bestKey = k;
        bestCount = c;
      }
    }

    // 閾値以下なら終了
    if (!bestKey || bestCount < minPairCount) break;

    const [a, b] = bestKey.split("\u0001");
    mergeRules.push([a, b]);

    // そのペアを結合して更新
    words = mergePairInWords(words, a, b);
  }

  return { merges: mergeRules };
};

const applyMergeOnce = (tokens: string[], a: string, b: string) => {
  const merged = a + b;
  const out: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    if (i < tokens.length - 1 && tokens[i] === a && tokens[i + 1] === b) {
      out.push(merged);
      i++;
    } else {
      out.push(tokens[i]);
    }
  }
  return out;
};

export const tokenizeWithMiniBpe = (
  input: string,
  model: BpeModel,
): string[] => {
  // 1文字単位に分解
  // ['り', 'ん', 'ご', 'の', '色', 'は', '赤', 'で', 'す']
  let tokens = toChars(input);

  // 学習した結合を順番に適用
  for (const [a, b] of model.merges) {
    tokens = applyMergeOnce(tokens, a, b);
  }

  return tokens;
};
