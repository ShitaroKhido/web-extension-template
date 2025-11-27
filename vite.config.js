import { defineConfig, loadEnv } from "vite";
import webExtension from "vite-plugin-web-extension";
import { fileURLToPath, URL } from "url";
import fs from "fs-extra";
import { resolve } from "path";

const root = resolve(process.cwd());
const srcDir = resolve(root, "src");
const tempDir = resolve(root, "temp");

// Base manifest configuration
const baseManifest = {
  version: "1.0.0",
  name: "Your Extension Name",
  description: "Description of your Chrome extension.",
  manifest_version: 3,
  permissions: ["storage", "tabs"],
  host_permissions: ["https://example.com/*"],
  icons: {
    16: "icon/icon.png",
    32: "icon/icon.png",
    48: "icon/icon.png",
    128: "icon/icon.png",
  },
  background: {
    service_worker: "js/background.js",
  },
  content_scripts: [
    {
      matches: ["https://example.com/*"],
      js: ["js/content.js"],
    },
  ],
  action: {
    default_popup: "popup.html",
    default_icon: {
      16: "icon/icon.png",
      32: "icon/icon.png",
      48: "icon/icon.png",
      128: "icon/icon.png",
    },
  },
  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self';",
  },
  web_accessible_resources: [
    {
      resources: ["*"],
      matches: ["<all_urls>"],
    },
  ],
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root, "");
  const browser = env.TARGET_BROWSER || "chrome";

  const manifest = { ...baseManifest };

  // Override manifest with environment variables
  manifest.name = env.VITE_APP_NAME || manifest.name;
  manifest.version = env.VITE_APP_VERSION || manifest.version;
  manifest.description = env.VITE_APP_DESCRIPTION || manifest.description;

  // Parse permissions from env (comma-separated)
  if (env.VITE_PERMISSIONS) {
    manifest.permissions = env.VITE_PERMISSIONS.split(',').map(p => p.trim());
  }

  // Parse host permissions from env (comma-separated)
  if (env.VITE_HOST_PERMISSIONS) {
    manifest.host_permissions = env.VITE_HOST_PERMISSIONS.split(',').map(p => p.trim());
  }

  // Parse content script matches from env (comma-separated)
  if (env.VITE_CONTENT_SCRIPT_MATCHES && manifest.content_scripts[0]) {
    manifest.content_scripts[0].matches = env.VITE_CONTENT_SCRIPT_MATCHES.split(',').map(p => p.trim());
  }

  if (browser === "firefox") {
    manifest.background = {
      scripts: ["js/background.js"],
    };
    manifest.browser_specific_settings = {
      gecko: {
        id: env.VITE_FIREFOX_ADDON_ID || "addon@example.com",
      },
    };
  }

  // Ensure temp directory exists
  fs.ensureDirSync(tempDir);
  const manifestPath = resolve(tempDir, "manifest.json");
  fs.writeJSONSync(manifestPath, manifest, { spaces: 2 });

  // Copy icons to temp directory for dev mode
  fs.copySync(resolve(root, "public/icon"), resolve(tempDir, "icon"));

  // Also copy icons to dist directory for both dev and build modes
  const distDir = resolve(root, "dist", browser);
  fs.ensureDirSync(resolve(distDir, "icon"));
  fs.copySync(resolve(root, "public/icon"), resolve(distDir, "icon"));

  return {
    root: srcDir,
    plugins: [
      webExtension({
        manifest: manifestPath,
        watchFilePaths: [],
        html: {
          "popup.html": "src/popup.html",
        },
      }),
    ],

    build: {
      outDir: resolve(root, "dist", browser),
      emptyOutDir: true,
      assetsInlineLimit: 0,
      manifest: false,
      rollupOptions: {},
    },

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
