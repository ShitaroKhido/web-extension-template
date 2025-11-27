# Chrome Extension Template

This is a template for creating Chrome extensions using Vite and Manifest V3.

## Setup

1. Clone or copy this template.
2. Add your extension icon to `public/icon/icon.png` (see `public/icon/README.md` for details).
3. Update `package.json` with your project name.
4. Configure your extension in `.env` file (name, version, permissions, etc.).
5. Add your extension logic in `src/js/`.
6. Run `npm install` to install dependencies.

## Configuration

The `.env` file allows you to customize your extension without modifying code:

- `VITE_APP_NAME` - Extension name
- `VITE_APP_VERSION` - Extension version
- `VITE_APP_DESCRIPTION` - Extension description
- `VITE_PERMISSIONS` - Comma-separated permissions (e.g., `storage,tabs,activeTab`)
- `VITE_HOST_PERMISSIONS` - Comma-separated host permissions (e.g., `https://example.com/*,https://google.com/*`)
- `VITE_CONTENT_SCRIPT_MATCHES` - Comma-separated URL patterns for content scripts
- `VITE_FIREFOX_ADDON_ID` - Firefox addon ID (for Firefox builds)

## Development

- `npm run dev` - Start development server.
- `npm run build` - Build for production.
- `npm run preview` - Preview the built extension.

### Sass Support

This template includes Sass/SCSS support out of the box. You can:

- Use `.scss` or `.sass` files in your project
- Import them in your JavaScript or HTML files
- Use Sass features like variables, nesting, mixins, and partials
- See `src/popup.scss` for an example

## Files Structure

- `public/` - Static assets
  - `icon/` - Extension icons
- `src/` - Source files
  - `popup.html` - Popup HTML
  - `popup.css` - Popup styles
  - `css/` - Additional CSS
  - `js/` - JavaScript files
- `temp/` - Temporary files (generated manifest)
- `dist/` - Built extension

## Author

Created by [ShitaroKhido](https://github.com/ShitaroKhido)
