// レビュー/再鑑役：投稿前の安全チェック（決定的なコードのガード）
// 自分が用意した信頼データが対象のPhase 1では、AIレビューではなくコード検査で十分。

// 必要に応じて追加（NGワード・誤爆を避けたい語）
const BANNED_WORDS = [];

// X の文字数は重み付き（上限280）。日本語・絵文字など全角は2、半角ASCIIは1。
// 140全角 ≒ 上限。ここでは重み280を上限としてチェックする。
function weightedLength(text) {
  let w = 0;
  for (const ch of text) {
    w += /^[\x00-\x7F]$/.test(ch) ? 1 : 2;
  }
  return w;
}

export function checkTweet(text, item) {
  const errors = [];
  if (!text || !text.trim()) errors.push("空のテキスト");
  const w = weightedLength(text);
  if (w > 280) errors.push(`長すぎ（重み${w} > 280）`);
  // A方針：リンクなし（URL入り投稿は$0.20と高額なため禁止）
  if (/https?:\/\//i.test(text)) errors.push("リンク(URL)が含まれている（A方針では不可）");
  for (const word of BANNED_WORDS) {
    if (word && text.includes(word)) errors.push(`禁止語: ${word}`);
  }
  // 商品データの必須項目
  if (!item.productName || !item.chainName) {
    errors.push("商品データ不備（商品名/チェーン名なし）");
  }
  return { ok: errors.length === 0, errors };
}
