// 文面作成役：商品情報から140字の宣伝文を生成（LLMを使う唯一の判断ステップ）
// モデルは Haiku 4.5（140字の宣伝文には十分・Opusの約1/5のコスト）
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // ANTHROPIC_API_KEY を環境変数から読む

const SYSTEM_PROMPT = `あなたはSNSマーケティングの専門家です。商品情報をもとに、X（旧Twitter）の宣伝投稿文を作成します。

ルール：
- 140文字以内
- 絵文字を2〜4個使用（自然な位置に配置）
- 発売日・チェーン名・商品名を必ず含める
- 毎回少し違う自然な文体で（同じ文の繰り返しはスパム判定の原因になるため避ける）
- ハッシュタグ不要
- URL・リンクは絶対に含めない
- 文章のみ返す（前置き・説明・引用符不要）`;

export async function generateTweet(item) {
  const d = new Date(item.releaseDate);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const accountLabel =
    item.account === "sweets" ? "スイーツ・デザート" : "グルメ・フード";

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `商品名: ${item.productName}\nチェーン名: ${item.chainName}\n発売日: ${month}月${day}日\n特徴: ${item.features}\n種別: ${accountLabel}`,
      },
    ],
  });

  const block = response.content.find((b) => b.type === "text");
  if (!block || block.type !== "text") throw new Error("生成に失敗しました");
  return block.text.trim();
}
