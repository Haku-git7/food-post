// オーケストレーター：選ぶ→作る→検査する→投稿する を各アカウントで実行
// DRY_RUN=true なら、生成と検査までで実投稿しない（X認証なし・無課金で動作確認できる）
import { loadPosts, loadState, saveState, pickNext, markPosted } from "./lib/data.mjs";
import { generateTweet } from "./lib/generate.mjs";
import { checkTweet } from "./lib/check.mjs";
import { postTweet } from "./lib/x.mjs";

// 運用するアカウント。まずは sweets のみ。
// グルメを始めるときは ENABLED_ACCOUNTS=sweets,gourmet にする（または既定値を変更）。
const ALL_ACCOUNTS = ["sweets", "gourmet"];
const enabled = (process.env.ENABLED_ACCOUNTS || "sweets")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const ACCOUNTS = ALL_ACCOUNTS.filter((a) => enabled.includes(a));
const DRY_RUN = process.env.DRY_RUN === "true";

async function main() {
  const posts = loadPosts();
  const state = loadState();
  let changed = false;

  console.log(`=== ねこポスト 自動投稿 ${DRY_RUN ? "(DRY RUN: 実投稿しません)" : ""} ===`);

  for (const account of ACCOUNTS) {
    console.log(`\n[${account}]`);

    // 1. 選ぶ（秘書役）
    const item = pickNext(posts, state, account);
    if (!item) {
      console.log("  未投稿の商品がありません。スキップ");
      continue;
    }
    console.log(`  対象: ${item.chainName} / ${item.productName} (id=${item.id})`);

    // 2. 作る（文面作成役・Haiku）
    let text;
    try {
      text = await generateTweet(item);
    } catch (e) {
      console.error(`  文面生成エラー: ${e.message}。スキップ`);
      continue;
    }
    console.log(`  生成: ${text}`);

    // 3. 検査する（レビュー/再鑑役）
    const { ok, errors } = checkTweet(text, item);
    if (!ok) {
      console.error(`  検査NG: ${errors.join(" / ")}。スキップ`);
      continue;
    }

    // 4. 投稿する（最終責任者役）
    if (DRY_RUN) {
      console.log("  [DRY RUN] 投稿せず、stateも更新しません");
      continue;
    }
    try {
      const res = await postTweet(account, text, item.imageUrl);
      console.log(`  投稿成功: tweet id=${res.id}`);
      markPosted(state, item.id);
      changed = true;
    } catch (e) {
      console.error(`  投稿エラー: ${e.message}。stateは更新しません`);
    }
  }

  if (changed) {
    saveState(state);
    console.log("\nstate.json を更新しました");
  } else {
    console.log("\nstate.json の更新なし");
  }
}

main().catch((e) => {
  console.error("致命的エラー:", e);
  process.exit(1);
});
