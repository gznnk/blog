# 静的ブログ生成ツール 仕様書（Markdown → HTML 最小構成）

## 目的
- Markdown 記事をビルド時に HTML に変換し、GitHub Pages（gh-pages）へ配置して公開できるようにする。
- 最小構成として以下 **7点を必ず実装**する：
  1. Markdown → HTML 変換
  2. frontmatter
  3. 共通 layout（header/main/footer）
  4. meta / OGP
  5. sitemap.xml
  6. robots.txt
  7. RSS（rss.xml）

## スコープ
- 静的サイトのみ（サーバーサイド実行、DB、会員、コメント、全文検索などは対象外）
- 画像最適化やOGP画像自動生成は対象外（ただし OG タグの枠は用意する）
- 対象言語：日本語中心（英語混在は許容）

---

## ディレクトリ構成

### 入力（Markdown）
- 記事は `content/posts/{YYYY}/{MM}/{DD}/slug.md` に配置する
- 階層は **年/月/日**で固定し、`slug.md` は自由（英小文字+ハイフン推奨）

例：
```
content/
  posts/
    2025/
      12/
        13/
          gh-pages-blog.md
```

### 出力（HTML）
- 生成先は `dist/`（または任意の公開ディレクトリ）
- 記事HTMLは `dist/posts/{YYYY}/{MM}/{DD}/slug/index.html` とする（末尾スラッシュURLを想定）

例：
```
dist/
  index.html
  posts/
    2025/
      12/
        13/
          gh-pages-blog/
            index.html
  sitemap.xml
  robots.txt
  rss.xml
  assets/...
```

---

## URL設計
- 記事URL（canonical含む）：
  - `https://{SITE_DOMAIN}/posts/{YYYY}/{MM}/{DD}/{slug}/`
- トップページ：
  - `https://{SITE_DOMAIN}/`

> `{SITE_DOMAIN}` は設定値（例：`example.com`）

---

## Markdown 記事フォーマット

### frontmatter（必須）
各 Markdown 先頭に YAML frontmatter を置く。

```md
---
title: "gh-pagesでブログを始める"
date: "2025-12-13"
description: "GitHub Pagesで技術ブログを始める最小構成"
tags: ["GitHub", "StaticSite"]
draft: false
---
本文...
```

#### フィールド仕様
- `title` (string, 必須)
- `date` (string, 必須) : `"YYYY-MM-DD"`（フォルダ階層と一致させる）
- `description` (string, 必須) : meta description / OGP description に使用
- `tags` (string[], 任意)
- `draft` (boolean, 任意, default=false)
  - `true` の場合はビルド対象外（一覧/サイトマップ/RSSにも出さない）

---

## ビルド成果物（必須7点）

### 1) Markdown → HTML 変換（必須）
- Markdown本文を HTML に変換する。
- 変換後は `<article>` 内に埋め込む（layoutに差し込む）。
- 見出し・リスト・コードブロック・リンク程度の基本は対応する。

出力の骨格：
```html
<article class="post">
  <h1>...</h1>
  <div class="post-meta">
    <time datetime="2025-12-13">2025-12-13</time>
    <!-- tags (optional) -->
  </div>
  <div class="post-body">
    <!-- converted HTML -->
  </div>
</article>
```

### 2) 共通 layout（必須）
全ページ（トップ、記事ページ）で共通の layout を使用する。

必須領域：
- `<header>`: サイト名（仮）/ナビ（最小）
- `<main>`: コンテンツ
- `<footer>`: 著作権表記/リンク（最小）

### 3) meta / OGP（必須）
#### 全ページ共通
- `<meta charset="utf-8">`
- `<meta name="viewport" content="width=device-width, initial-scale=1">`
- `<link rel="canonical" href="...">`

#### 記事ページ
- `<title>` は `{title} - {siteName}` 形式
- `<meta name="description" content="{description}">`
- OGP最小：
```html
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:type" content="article">
<meta property="og:url" content="{canonicalUrl}">
<meta property="og:site_name" content="{siteName}">
```

#### トップページ
- `<title>` は `{siteName}`
- `<meta name="description" content="{siteDescription}">`
- OGPは `og:type=website`

> og:image は任意（未設定でもビルドは成功する）

### 4) sitemap.xml（必須）
- `dist/sitemap.xml` を生成する。
- 対象URL：
  - トップページ
  - 公開対象の記事ページ（draft除外）
- `lastmod` は記事 `date` を用いる（更新日の追跡は対象外）

### 5) robots.txt（必須）
- `dist/robots.txt` を生成する。
- 内容：
```txt
User-agent: *
Allow: /

Sitemap: https://{SITE_DOMAIN}/sitemap.xml
```

### 6) RSS（rss.xml）（必須）
- `dist/rss.xml` を生成する。
- 対象記事：draft除外
- 最大件数：`RSS_MAX_ITEMS`（例：20〜50、設定可能）

---

## トップページ（index.html）仕様（必須）

### 要件
- `dist/index.html` を生成する。
- 画面構成：
  - メイン：**最新の記事の内容を全文表示**
  - サイド：記事一覧（最大 N 件）

### “最新” の定義
- 公開対象記事（draft除外）のうち、日付が最大のもの。
- 日付の比較は `"YYYY-MM-DD"` の辞書順で一致する前提（ISO形式なのでOK）。

数式表現：
- 記事集合を \( P \) として、最新記事 \( p^\* \) は  
  \[
  p^\* = \arg\max_{p \in P} \text{date}(p)
  \]

### サイド記事一覧
- 公開対象記事を `date` 降順で並べ、先頭から最大 `SIDEBAR_MAX_ITEMS` 件表示する。
- “最大値をもつ”=最新順（降順）で上から取る、の意味として実装する。

例（HTML）：
```html
<aside class="sidebar">
  <h2>Posts</h2>
  <ul class="post-list">
    <li>
      <a href="/posts/2025/12/13/gh-pages-blog/">gh-pagesでブログを始める</a>
      <time datetime="2025-12-13">2025-12-13</time>
    </li>
  </ul>
</aside>
```

### レイアウト
- 2カラム（PC）：main + sidebar
- 1カラム（モバイル）：sidebar を下に落とす（CSSで対応）
- CSSは最小で良い（読みやすさ優先）

---

## 記事ページ生成仕様

### 生成対象
- `content/posts/**/**/**/slug.md` を探索（glob）
- frontmatter `draft: true` は除外

### 出力先
- `dist/posts/{YYYY}/{MM}/{DD}/{slug}/index.html`

### ページ内容
- 共通layout + 記事HTML
- サイドに記事一覧を出しても良い（トップと共通化推奨）

---

## 記事一覧データ（ビルド時生成）
ビルドの内部で記事メタデータ一覧を生成する（JSONでもメモリでもOK）。

各記事の最小メタ：
- `title`
- `date`
- `description`
- `tags`
- `slug`
- `inputPath`
- `outputPath`
- `url`（canonical）

---

## 設定（Config）
`site.config.json` などで設定可能にする（形式は自由）。

必須設定：
- `siteName`
- `siteDescription`
- `siteDomain`（例：`example.com`）
- `sidebarMaxItems`（例：50）
- `rssMaxItems`（例：30）
- `timezone`（例：`Asia/Tokyo`：RSSのpubDate生成に使用してもよい）

---

## エラー/バリデーション
ビルド時に以下はエラー扱い（exit code != 0）：
- frontmatter に `title/date/description` が無い
- `date` が `"YYYY-MM-DD"` 形式でない
- フォルダ階層の `{YYYY}/{MM}/{DD}` と frontmatter `date` が一致しない
- 同一URL（同一slug+date）衝突

---

## 実行フロー（ビルド）
1. 記事ファイル探索
2. frontmatter 解析・バリデーション
3. 公開対象（draft除外）のメタ一覧作成
4. 最新記事決定（date最大）
5. 各記事をHTML化して `dist/posts/.../index.html` に出力
6. `dist/index.html` を生成（最新記事本文 + サイド一覧）
7. `sitemap.xml / robots.txt / rss.xml` を生成
8. 静的アセット（CSS等）を `dist/assets` に配置

---

## 非機能要件（最低限）
- 生成は決定的（同一入力→同一出力）
- ビルド時間は記事数に線形（O(n)）でよい
- 文字コードは UTF-8
- 出力HTMLは最低限妥当（doctype/head/bodyあり）

---

## 将来拡張（今回は実装しないが設計余地を残す）
- タグページ
- 記事一覧ページ（全件、ページネーション）
- OGP画像自動生成
- シンタックスハイライト強化
- RSS/サイトマップの更新日時追跡（git log等）
- 404.html / redirect

---

## 受け入れ条件（Acceptance Criteria）
- `content/posts` に2件以上記事を置き `build` を実行すると：
  - `dist/index.html` が生成され、最新記事が本文表示される
  - サイドに `sidebarMaxItems` 上限で記事一覧が出る
  - 各記事が `dist/posts/YYYY/MM/DD/slug/index.html` に生成される
  - `dist/sitemap.xml` がトップ+記事URLを含む
  - `dist/robots.txt` が sitemap を指す
  - `dist/rss.xml` に最新 `rssMaxItems` 件が含まれる
- `draft: true` の記事はすべての出力から除外される
- frontmatter/date と階層が不一致ならビルドは失敗する
