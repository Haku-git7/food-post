import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

const client = new Anthropic();

const SYSTEM_PROMPT = `あなたはSNSマーケティングの専門家です。商品情報をもとに、X（旧Twitter）の宣伝投稿文を作成します。

ルール：
- 140文字以内
- 絵文字を2〜4個使用（自然な位置に配置）
- 発売日・チェーン名・商品名を必ず含める
- 毎回少し違う自然な文体で
- ハッシュタグ不要
- 文章のみ返す（前置き・説明・引用符不要）`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') {
    return Response.json({ error: 'APIキーが設定されていません' }, { status: 500 });
  }

  try {
    const { chainName, productName, releaseDate, features, account } = await request.json();

    const d = new Date(releaseDate);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const accountLabel = account === 'sweets' ? 'スイーツ・デザート' : 'グルメ・フード';

    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 300,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `商品名: ${productName}\nチェーン名: ${chainName}\n発売日: ${month}月${day}日\n特徴: ${features}\n種別: ${accountLabel}`,
        },
      ],
    });

    const block = response.content.find((b) => b.type === 'text');
    if (!block || block.type !== 'text') {
      return Response.json({ error: '生成に失敗しました' }, { status: 500 });
    }

    return Response.json({ tweetText: block.text.trim() });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return Response.json({ error: 'APIキーが無効です' }, { status: 401 });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return Response.json({ error: 'レート制限に達しました。しばらくしてからお試しください' }, { status: 429 });
    }
    console.error('Claude API error:', err);
    return Response.json({ error: 'APIエラーが発生しました' }, { status: 500 });
  }
}
