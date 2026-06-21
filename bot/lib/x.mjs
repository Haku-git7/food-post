// 最終責任者役：実際にXへ投稿する（決定的なコード。LLMには実行させない）
// 認証は OAuth 1.0a（各アカウントの4つのキー）。画像は v1.1 でアップロード→v2 で投稿。
import { TwitterApi } from "twitter-api-v2";

// アカウント別の認証情報を環境変数から取得
function credsFor(account) {
  const prefix = account === "sweets" ? "X_SWEETS" : "X_GOURMET";
  return {
    appKey: process.env[`${prefix}_APP_KEY`],
    appSecret: process.env[`${prefix}_APP_SECRET`],
    accessToken: process.env[`${prefix}_ACCESS_TOKEN`],
    accessSecret: process.env[`${prefix}_ACCESS_SECRET`],
  };
}

function clientFor(account) {
  const c = credsFor(account);
  for (const [k, v] of Object.entries(c)) {
    if (!v) throw new Error(`X認証情報が未設定: ${account} の ${k}`);
  }
  return new TwitterApi(c);
}

// 画像URLを取得して media_id を返す。失敗時は null（テキストのみ投稿にフォールバック）
async function uploadImage(client, imageUrl) {
  if (!imageUrl) return null;
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const mime = res.headers.get("content-type") || "image/jpeg";
    return await client.v1.uploadMedia(buf, { mimeType: mime });
  } catch (e) {
    console.warn(`  画像アップロード失敗（テキストのみで投稿）: ${e.message}`);
    return null;
  }
}

export async function postTweet(account, text, imageUrl) {
  const client = clientFor(account);
  const mediaId = await uploadImage(client, imageUrl);
  const payload = mediaId ? { text, media: { media_ids: [mediaId] } } : { text };
  const { data } = await client.v2.tweet(payload);
  return data; // { id, text }
}
