# web-extension-template

Minimal Vite + Manifest V3 template for Chrome and Firefox extensions.

## Quick start

Install:

```bash
npm install
```

Dev (watch):

```bash
npm run dev:chrome
```

Build:

```bash
npm run build
```

## Load locally

- Chrome: `chrome://extensions/` → enable Developer mode → Load unpacked → `output/dist-chrome`
- Firefox: `about:debugging` → Load Temporary Add-on → `output/dist-firefox/manifest.json` or `.xpi`

## Notes

- Copy `.env.example` → `.env` to customize metadata.
- Built artifacts: `output/dist-chrome`, `output/dist-firefox`, `output/package`.
