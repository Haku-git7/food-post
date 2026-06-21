// 秘書役：投稿対象の選択と「投稿済み」状態の管理（すべて決定的なコード）
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const POSTS_PATH = join(__dirname, "..", "..", "src", "data", "posts.json");
const STATE_PATH = join(__dirname, "..", "state.json");

export function loadPosts() {
  return JSON.parse(readFileSync(POSTS_PATH, "utf8"));
}

export function loadState() {
  try {
    return JSON.parse(readFileSync(STATE_PATH, "utf8"));
  } catch {
    return { posted: [] };
  }
}

export function saveState(state) {
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n");
}

// 未投稿の中から、そのアカウント向けの次の1件を返す（発売日が早い順）。なければ null
export function pickNext(posts, state, account) {
  const postedIds = new Set(state.posted);
  const candidates = posts
    .filter((p) => p.account === account && !postedIds.has(p.id))
    .sort((a, b) => String(a.releaseDate).localeCompare(String(b.releaseDate)));
  return candidates[0] || null;
}

export function markPosted(state, id) {
  if (!state.posted.includes(id)) state.posted.push(id);
}
