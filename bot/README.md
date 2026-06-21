# ねこポスト 自動投稿bot（Phase 1）

スイーツ用・グルメ用の2つのXアカウントへ、商品の宣伝文＋写真を自動投稿します。
**A方針：文章＋写真・リンクなし**（リンク投稿はX APIで$0.20と高額なため使わない）。

## 仕組み（1パイプライン）
`run.mjs` が各アカウントについて順に実行します：

1. **選ぶ**（`lib/data.mjs`）… `../src/data/posts.json` から未投稿の商品を1件選択（`state.json`で重複防止）
2. **作る**（`lib/generate.mjs`）… Haiku 4.5 で140字の宣伝文を生成
3. **検査**（`lib/check.mjs`）… 文字数・URL混入・必須項目をコードでチェック
4. **投稿**（`lib/x.mjs`）… 画像をアップロードしてXへ投稿、`state.json`に記録

LLMを使うのは「2.作る」だけ。あとはすべて決定的なコードです。

---

## セットアップ（あなたの作業）

### 1. Xの開発者アカウント（2アカウント分）
各Xアカウントで別々に：
1. https://developer.x.com で開発者登録 → アプリ作成
2. アプリの権限を **Read and Write** に設定
3. **従量課金（pay-per-use）の支払い設定**を行う（※2026年2月から無料枠は廃止）
4. 次の4つのキーを発行：
   - API Key（=App Key）/ API Secret（=App Secret）
   - Access Token / Access Token Secret（**自分のアカウント用**を開発者ポータルで直接発行。OAuth認可フロー不要）

### 2. Anthropic APIキー
https://console.anthropic.com でAPIキーを発行（文面生成用。Haikuなので低コスト）。

### 3. GitHub Secrets を登録
リポジトリ → Settings → Secrets and variables → Actions → New repository secret：

| Secret名 | 中身 |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic APIキー |
| `X_SWEETS_APP_KEY` | スイーツ垢の API Key |
| `X_SWEETS_APP_SECRET` | スイーツ垢の API Secret |
| `X_SWEETS_ACCESS_TOKEN` | スイーツ垢の Access Token |
| `X_SWEETS_ACCESS_SECRET` | スイーツ垢の Access Token Secret |
| `X_GOURMET_APP_KEY` | グルメ垢の API Key |
| `X_GOURMET_APP_SECRET` | グルメ垢の API Secret |
| `X_GOURMET_ACCESS_TOKEN` | グルメ垢の Access Token |
| `X_GOURMET_ACCESS_SECRET` | グルメ垢の Access Token Secret |

> **Phase 1スタートは `ANTHROPIC_API_KEY` ＋ `X_SWEETS_*`（4つ）= 計5個だけでOK**。グルメ（`X_GOURMET_*`）は後で。グルメを始めるときは `auto-post.yml` の `ENABLED_ACCOUNTS` を `sweets,gourmet` に変更し、グルメのSecretsを登録。

---

## 動作確認の順番（安全第一）

### ① まずDRY RUN（実投稿しない・無課金）
GitHub → Actions → 「ねこポスト 自動投稿」→ **Run workflow**（`dry_run` は既定でON）。
ログに生成された文面が出ればOK。**Anthropic APIキーだけあれば確認可**（X認証は不要）。

ローカルでも確認可：
```bash
cd bot && npm install
DRY_RUN=true ANTHROPIC_API_KEY=sk-ant-... node run.mjs
```

### ② 本番テスト（1回だけ実投稿）
Actions → Run workflow → **dry_run のチェックを外して**実行 → 各アカウントに1件ずつ投稿される。

### ③ 自動運用開始
あとは `auto-post.yml` の cron に従って自動投稿（既定：1日2回）。

---

## 投稿頻度とコスト
- 既定スケジュール：`auto-post.yml` の cron（12:00 / 19:00 JST）。頻度はここを編集。
- コスト目安（A方針）：1投稿 ≈ $0.02（≒¥3）。例）2アカウント×1日2投稿×30日 ≈ **月¥400前後**。

## 注意
- サンプルの `posts.json` は5件のみ。すぐ在庫切れになる（Phase 2で新商品の自動収集を追加予定）。
- `state.json` は投稿済みIDの記録。スケジュール実行時はActionが自動でcommitし戻す。
- 投稿に失敗したアカウントはスキップし、`state`は更新しない（次回再試行）。
