import { defineConfig, loadEnv } from "vite";
import webExtension from "vite-plugin-web-extension";
import fs from "fs";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const target = process.env.TARGET || env.VITE_TARGET || "chrome";

  const parseList = (val) => {
    if (!val) return undefined;
    return val
      .toString()
      .split(/\s*,\s*/)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  return {
  root: "src",
  plugins: [
    webExtension({
      manifest: () => {
        const manifest = JSON.parse(
          fs.readFileSync("src/manifest.json", "utf8")
        );

        // Allow overriding manifest fields from VITE env variables.
        // Basic values
        manifest.name = env.VITE_APP_NAME || manifest.name;
        manifest.version = env.VITE_APP_VERSION || manifest.version;
        manifest.description = env.VITE_APP_DESCRIPTION || manifest.description;

        // Icons are read from `src/manifest.json` and `src/public/icons/` — we do not override
        // icons from env variables to ensure paths remain valid and assets are copied
        // correctly during build. If you want to change icons, update the files in `src/public/icons`.

        // Merge permissions
        const envPerms = parseList(env.VITE_PERMISSIONS);
        if (Array.isArray(envPerms) && envPerms.length > 0) {
          manifest.permissions = Array.from(
            new Set([...(manifest.permissions || []), ...envPerms])
          );
        }

        // Host permissions (MV3) or permissions that look like URLs
        const envHostPerms = parseList(env.VITE_HOST_PERMISSIONS);
        if (Array.isArray(envHostPerms) && envHostPerms.length > 0) {
          manifest.host_permissions = Array.from(
            new Set([...(manifest.host_permissions || []), ...envHostPerms])
          );
        }

        // Content script matches
        const envMatches = parseList(env.VITE_CONTENT_SCRIPT_MATCHES);
        if (Array.isArray(envMatches) && envMatches.length > 0) {
          for (const cs of manifest.content_scripts || []) {
            cs.matches = envMatches;
          }
        }

        // Firefox specific id
        if (target === "firefox") {
          manifest.manifest_version = 2;
          manifest.background = {
            scripts: ["polyfill.js", "background.js"],
          };
          manifest.browser_action = manifest.action;
          delete manifest.action;
          manifest.browser_specific_settings = manifest.browser_specific_settings || {
            gecko: {},
          };
          if (env.VITE_FIREFOX_ADDON_ID) {
            manifest.browser_specific_settings.gecko.id = env.VITE_FIREFOX_ADDON_ID;
          } else {
            manifest.browser_specific_settings.gecko.id =
              manifest.browser_specific_settings.gecko.id || "my-extension@example.com";
          }
        } else {
          // Chrome: service worker
          manifest.background.service_worker = "background.js";
          // Ensure polyfill is loaded before content script code
          for (const cs of manifest.content_scripts || []) {
            cs.js = cs.js || [];
            if (!cs.js.includes("polyfill.js")) cs.js.unshift("polyfill.js");
          }
        }

        return manifest;
      },
      watchFilePaths: ["src"],
    }),
  ],

  build: {
    outDir: target === "firefox" ? "../dist/firefox" : "../dist/chrome",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: false, // forces one output per entry, avoids splitting
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name][extname]",
      },
    },

    // Absolute override against plugin forcing iife
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  }
  };
});
