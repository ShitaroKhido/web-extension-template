# Minimal Web Extension Template

A small, minimal template for building browser extensions. It focuses on Vite-based builds for Manifest V3 (Chrome) and optional Firefox support.

Quick Start

1. Install dependencies

```bash
npm install
```

1. Run dev server (Chrome):

```bash
npm run dev:chrome
```

Build

- Chrome only:

```bash
npm run build:chrome
```

- Firefox only:

```bash
npm run build:firefox
```

- Both targets (Chrome + Firefox):

```bash
npm run build:all
```

- Build and create ZIP packages:

```bash
npm run build:zip
```

Load the build in Chrome:

- Open `chrome://extensions`, enable Developer Mode, and choose "Load unpacked" → `dist/chrome`.

Icons

- Place static icons in `src/public/icons/` (e.g., `icon-16.svg`, `icon-48.svg`, `icon-128.svg`).
- `src/manifest.json` references these icons and the build will include them in `dist/*/icons/`.

Environment variables

This project supports `.env` files; Vite loads variables that start with `VITE_` and we map the important ones to the manifest during build:

- `VITE_APP_NAME` - Optional manifest name override
- `VITE_APP_VERSION` - Optional manifest version override
- `VITE_APP_DESCRIPTION` - Optional manifest description override
- `VITE_PERMISSIONS` - Comma-separated permissions to merge into `manifest.permissions`
- `VITE_HOST_PERMISSIONS` - Comma-separated host permissions for `manifest.host_permissions`
- `VITE_CONTENT_SCRIPT_MATCHES` - Comma-separated content script match patterns
- `VITE_FIREFOX_ADDON_ID` - Optional Firefox add-on id for `browser_specific_settings.gecko.id`
- `VITE_TARGET` - Optional target override in `.env` (e.g., `VITE_TARGET=firefox`)

Project layout

- `src/` - Source files (Vite root). Keep your popup, service worker, and content scripts here.

- `popup/` - Popup HTML + JS
- `background.js` - Background/service worker
- `content-script.js` - Example content script
- `manifest.json` - Manifest (we use a script to adapt for Firefox)
- `public/` - Static files copied to build (icons live here)

Demo: popup → content script

1. Build or run dev server and load the extension in the browser.
2. Open any web page and click the extension icon to open the popup.
3. Click the button: the popup sends a message to the content script; the content script highlights the page briefly and the popup shows a response.

That's all — this template is minimal so it's quick to fork and extend.
