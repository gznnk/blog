---
title: "iframe sandbox in practice: no sandbox is permissive, sandbox defaults to deny-all, then allow only what you need"
date: 2025-12-20
description: Overview of iframe sandbox, risks of omitting it, the default deny-all behavior, list of allow-* tokens, and least-privilege design in practice.
lang: "en"
tags:
  - web
  - security
  - html
draft: false
---

# iframe `sandbox` in practice: no sandbox is permissive, sandbox defaults to deny-all, then allow only what you need

The `<iframe>` element is useful, but it also embeds third‑party content directly into your page. The `sandbox` attribute is a browser-enforced safety mechanism that reduces what the framed document is allowed to do.

This post covers:

- What `sandbox` is
- Why omitting it can be overly permissive
- Why adding it "breaks everything" (deny-all by default)
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

## 2. Why "no sandbox" can be too permissive
Without `sandbox`, the iframe content behaves mostly like a normal page (within the usual web security model). If the embedded content is malicious or compromised, it has more room to:

- Run scripts normally
- Open popups / try to navigate users
- Trigger form flows or other UX manipulation
- Increase interaction surfaces in certain origin setups

Even if other defenses exist (CSP, browser popup blocking, etc.), `sandbox` is a strong per-iframe control.

---

## 3. Why adding `sandbox` defaults to "deny-all"
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
- `allow-same-origin`: keeps the iframe's real origin (avoids "unique origin" behavior).
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
