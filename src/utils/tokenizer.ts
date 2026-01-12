import { DEFAULT_DICT } from "../assets/tokenizerDict";

export const miniTokenize = (
  input: string,
  dict: string[] = DEFAULT_DICT
): string[] => {
  // dictを文字数の長い順に並べる
  const sorted = [...dict].sort((a, b) => b.length - a.length);

  const tokens: string[] = [];
  let i = 0;

  while (i < input.length) {
    let matched: string | null = null;

    // dictの文字とマッチしているか総当りで確認
    for (const word of sorted) {
      if (input.startsWith(word, i)) {
        matched = word;
        break;
      }
    }

    if (matched) {
      tokens.push(matched);
      i += matched.length;
    } else {
      // どれにも当たらなければ1文字
      tokens.push(input[i]);
      i += 1;
    }
  }

  return tokens;
};
