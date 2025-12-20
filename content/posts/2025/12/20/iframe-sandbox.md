---
title: iframeのsandbox属性：指定しないとザル、付けると全拒否、必要な穴だけ開ける
date: 2025-12-20
description: iframe sandboxの概要、未指定のリスク、デフォルトの「全拒否」、allow-*トークン一覧と実務での最小権限設計を日本語/英語で整理。
tags:
  - web
  - security
  - html
draft: false
---

# iframe の `sandbox` 属性：指定しないとザル、付けると全拒否、必要な穴だけ開ける（JP）

`<iframe>` は便利ですが、「外部コンテンツを自分のページの中で動かす」都合上、セキュリティ事故の起点にもなりやすい要素です。そこで使うのが `sandbox` 属性です。

この記事では、以下の流れで整理します。

- `sandbox` の概要
- 指定しないと“ザル”になりがちな理由
- 付けるとデフォルトで“全拒否”になる理由
- `allow-*` の項目と効果（何を許可すると何が起きるか）
- 実務の考え方（最小権限）

---

## 1. 概要：`sandbox` は iframe を「権限落とし」する安全装置

`<iframe sandbox>` は、iframe 内で読み込むページに対して **ブラウザが強制する追加制限**です。

```html
<iframe src="https://example.com/embed" sandbox></iframe>
```

考え方はシンプルで、

1) まず全部禁止（強めに）  
2) 必要な機能だけ `allow-*` で許可  

という「deny by default」の設計になっています。

---

## 2. `sandbox` を指定しないと“ザル”になりがちな理由

`sandbox` なしの iframe は、基本的に「普通の Web ページ」を読み込むのと同じです（同一オリジン制約などは当然ありますが、埋め込み側としての安全弁は弱い）。

そのため、埋め込む先が悪意ある/乗っ取られた/広告配信等で想定外のコードが混ざった場合に、次のような“面倒”が起きやすくなります（発生可否はブラウザや状況に依存）：

- 望まないポップアップや別タブ誘導
- クリック誘導やフォーム送信などのユーザー操作の誘導
- 何らかの形でトップページ遷移を狙う挙動
- （条件が揃うと）親ページとの相互作用が増える

要するに、外部コンテンツが「普通に動きすぎる」ことが問題になりがちです。

---

## 3. `sandbox` を“とりあえず付ける”と全拒否になる

`iframe` に `sandbox` を付けただけの状態はこうです：

```html
<iframe src="..." sandbox></iframe>
```

この状態だと多くの場合、以下が禁止されます。

- スクリプト実行（＝多くの埋め込みが動かない）
- フォーム送信
- ポップアップ
- トップレベル（親ページ）のナビゲーション
- その他いくつかの API や権限

「壊れる」のは正常で、ここから必要な権限を一つずつ足していくのが正しい使い方です。

---

## 4. 指定できる項目（`allow-*`）と効果

`sandbox` はスペース区切りで許可トークンを追加します。

```html
<iframe
  src="..."
  sandbox="allow-scripts allow-forms"
></iframe>
```

以下、よく使うものを中心に“何が解放されるか”の観点でまとめます（ブラウザ差分・仕様更新があるので、最終的には MDN 等で挙動確認推奨）。

### `allow-scripts`
- iframe 内の JavaScript 実行を許可します。
- 多くのウィジェット/埋め込み（動画、地図、コメント等）で必須になりがちです。

注意点：
- `allow-same-origin` が無い場合、iframe は “ユニークオリジン” 扱いになり、スクリプトが動いても権限は制限されたままになりやすいです（安全寄り）。

### `allow-same-origin`
- `sandbox` による “ユニークオリジン化” を解除し、iframe を本来のオリジンとして扱います。

注意点（重要）：
- `allow-scripts` と `allow-same-origin` を両方許可すると、iframe はかなり「普通のページ」に近い力を取り戻します。便利ですが、サンドボックスの安全性は落ちやすいです。

### `allow-forms`
- フォーム送信を許可します。

### `allow-popups`
- `window.open()` などのポップアップを許可します。
- OAuth や決済導線などで必要になることがあります。

### `allow-popups-to-escape-sandbox`
- iframe が開いたポップアップが、sandbox 制限を引き継がずに開くことを許可します。

### `allow-top-navigation`
- iframe から親ページ（トップレベル）を遷移させることを許可します。

強い権限です。悪用されると「勝手に遷移」なので基本は慎重に。

### `allow-top-navigation-by-user-activation`
- ユーザー操作（クリック等）があった場合に限りトップレベル遷移を許可します。
- `allow-top-navigation` より安全寄りで、実務ではこちらを検討しがちです。

### `allow-modals`
- `alert/confirm/prompt` を許可します。

### `allow-downloads`
- iframe からのダウンロード開始を許可します。

### `allow-pointer-lock`
- Pointer Lock API（ゲーム等でマウス固定）を許可します。

### `allow-presentation`
- Presentation API を許可します。

### `allow-orientation-lock`
- 画面向き固定を許可します（モバイル向け）。

---

## 5. 実務の指針：最小権限（Least Privilege）

実務では、だいたいこの手順が安定です。

1. まず `sandbox` だけ付ける（壊れるのを確認）
2. 動かすために必要な `allow-*` を最小限だけ追加
3. 特に `allow-same-origin` は最後まで悩む（可能なら避ける）

例：

### 例1：静的埋め込み（まずこれが理想）
```html
<iframe src="..." sandbox></iframe>
```

### 例2：スクリプトは必要（でも same-origin は不要にしたい）
```html
<iframe src="..." sandbox="allow-scripts"></iframe>
```

### 例3：OAuth/決済でポップアップが必要
```html
<iframe src="..." sandbox="allow-scripts allow-popups"></iframe>
```

---

## 6. `sandbox` と一緒に検討したい属性/仕組み

`sandbox` は強力ですが万能ではありません。併用で効果が出やすいもの：

- `referrerpolicy`：Referer を抑制
- `allow`（Permissions Policy）：カメラやマイク等の機能許可
- CSP：親ページ側/埋め込み側双方での制限
- 埋め込まれる側の `frame-ancestors`（CSP）や `X-Frame-Options`：そもそも誰に埋め込ませるか

---

## まとめ
- `sandbox` は iframe を「デフォルト全拒否」に落とす安全装置
- 未指定は“普通に動きすぎる”ので、外部埋め込みほどリスクが上がる
- `allow-*` で必要な穴だけ開ける（最小権限）
- `allow-scripts` + `allow-same-origin` の同時許可は特に慎重に

---

# iframe `sandbox` in practice: no sandbox is permissive, sandbox defaults to deny-all, then allow only what you need (EN)

The `<iframe>` element is useful, but it also embeds third‑party content directly into your page. The `sandbox` attribute is a browser-enforced safety mechanism that reduces what the framed document is allowed to do.

This post covers:

- What `sandbox` is
- Why omitting it can be overly permissive
- Why adding it “breaks everything” (deny-all by default)
- Common `allow-*` tokens and their effects
- A least-privilege workflow

---

## 1. What `sandbox` is
Add `sandbox` to an iframe to apply extra restrictions:

```html
<iframe src="https://example.com/embed" sandbox></iframe>
```

The model is: **deny by default, allow explicitly** via space-separated tokens.

---

## 2. Why “no sandbox” can be too permissive
Without `sandbox`, the iframe content behaves mostly like a normal page (within the usual web security model). If the embedded content is malicious or compromised, it has more room to:

- Run scripts normally
- Open popups / try to navigate users
- Trigger form flows or other UX manipulation
- Increase interaction surfaces in certain origin setups

Even if other defenses exist (CSP, browser popup blocking, etc.), `sandbox` is a strong per-iframe control.

---

## 3. Why adding `sandbox` defaults to “deny-all”
This:

```html
<iframe src="..." sandbox></iframe>
```

typically disables many capabilities: scripts, form submission, popups, top-level navigation, and more. Things often break—and that is expected. You then add only the permissions you truly need.

---

## 4. Common `allow-*` tokens and what they unlock

Example:

```html
<iframe src="..." sandbox="allow-scripts allow-forms"></iframe>
```

Frequently used tokens:

- `allow-scripts`: enables JavaScript execution in the iframe.
- `allow-same-origin`: keeps the iframe’s real origin (avoids “unique origin” behavior).
  - **Caution:** `allow-scripts` + `allow-same-origin` together can significantly reduce the security benefits of sandboxing.
- `allow-forms`: allows form submission.
- `allow-popups`: allows popups (`window.open()`, etc.).
- `allow-popups-to-escape-sandbox`: popups opened by the iframe are not sandboxed.
- `allow-top-navigation`: allows the iframe to navigate the top-level page (powerful; use carefully).
- `allow-top-navigation-by-user-activation`: top navigation only after a user gesture (safer alternative).
- `allow-modals`: allows `alert/confirm/prompt`.
- `allow-downloads`: allows initiating downloads.
- `allow-pointer-lock`: allows Pointer Lock API.
- `allow-presentation`: allows Presentation API.
- `allow-orientation-lock`: allows orientation lock.

Browser behavior can vary slightly and evolves; validate against up-to-date references for production.

---

## 5. Practical workflow: least privilege
1) Add `sandbox` alone, observe what breaks.  
2) Add only the minimum `allow-*` tokens required.  
3) Treat `allow-same-origin` as a last resort when possible.

Examples:

```html
<!-- Static embed -->
<iframe src="..." sandbox></iframe>

<!-- Needs JS, but avoid same-origin -->
<iframe src="..." sandbox="allow-scripts"></iframe>

<!-- Needs popups (OAuth / payment flows) -->
<iframe src="..." sandbox="allow-scripts allow-popups"></iframe>
```

---

## 6. Related controls to consider
- `referrerpolicy`
- `allow` (Permissions Policy)
- CSP
- `frame-ancestors` / `X-Frame-Options` on the embedded site

---

## Summary
- `sandbox` is a security control that restricts iframe capabilities.
- Without it, embedded content can be too powerful.
- With it, the default is close to deny-all.
- Add `allow-*` tokens carefully, aiming for least privilege.
