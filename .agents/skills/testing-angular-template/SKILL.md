---
name: testing-angular-template
description: How to build, run, and test the angular-material-template app (Angular 18). Use when setting up, running unit tests, or UI-testing this repo.
---

# Testing angular-material-template

Angular 18 app (Material + MDC). Build/test run on **Node 18** (`nvm use 18`).

## Commands
- Install: `npm install`
- Lint: `npm run lint`
- Build: `npm run build` (esbuild application builder; a `bundle initial exceeded budget` warning is pre-existing and harmless)
- Dev server: `npm start` → http://localhost:4200

## Unit tests (Karma/Jasmine)
Karma needs a real Chrome binary and a no-sandbox launcher (the `ChromeHeadlessNoSandbox` launcher is committed in `karma.conf.js`). The `google-chrome` on PATH is a Devin CDP wrapper, not a real browser — point CHROME_BIN at the Playwright Chromium instead:

```bash
export CHROME_BIN=$(ls /opt/.devin/playwright_browsers/chromium-*/chrome-linux/chrome | head -1)
npx ng test --watch=false --browsers=ChromeHeadlessNoSandbox
```

Expect **33/34 passing**. The one failure (`LocalDatePipe returns valid date given utc`) is timezone-dependent — it expects UTC+1 output. Run with `TZ=Europe/London` to get 34/34. Do not change that assertion.

## UI testing / auth
Auth is **mocked**: `AuthenticationService.login()` accepts any email/password, and `getCurrentUser()` returns a hardcoded admin (John Doe). So every route is reachable without a backend, and navigating to `/` lands directly on `/dashboard`.

Key routes: `/auth/login`, `/dashboard`, `/customers`, `/users`, `/account/profile`, `/icons`, `/typography`, `/about`.

Note: there is no backend, so list screens (Users/Customers) show empty states ("No users exist"); the Icons page embeds an external iframe that won't load offline. Neither is a bug.
