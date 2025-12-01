// Imports
import { defineConfig, loadEnv } from "vite";
import webExtension from "vite-plugin-web-extension";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = loadEnv(process.env.NODE_ENV, __dirname);
const target = process.env.TARGET || "chrome"; // Get target browser from env

// Base manifest configuration
const getManifest = () => {
  const manifest = {
    manifest_version: 3,
    name: env.VITE_APP_NAME || "My Vite Web Extension",
    version: env.VITE_APP_VERSION || "1.0.0",
    description: env.VITE_APP_DESCRIPTION || "A web extension built with Vite",
    action: {
      default_popup: "popup.html",
      default_icon: {
        16: "icons/icon-16.svg",
        48: "icons/icon-48.svg",
        128: "icons/icon-128.svg",
      },
    },
    // Host Permissions
    host_permissions: env.VITE_HOST_PERMISSIONS
      ? env.VITE_HOST_PERMISSIONS.split(",")
      : ["<all_urls>"],
    // Permissions
    permissions: env.VITE_PERMISSIONS
      ? env.VITE_PERMISSIONS.split(",")
      : ["storage", "tabs"],
    background: {
      service_worker: "js/background.js",
    },
    content_scripts: [
      {
        matches: env.VITE_CONTENT_SCRIPT_MATCHES
          ? env.VITE_CONTENT_SCRIPT_MATCHES.split(",")
          : ["<all_urls>"],
        js: ["js/content.js"],
      },
    ],
  };

  // Firefox-specific settings
  if (target === "firefox") {
    manifest.browser_specific_settings = {
      gecko: {
        id: env.VITE_FIREFOX_ADDON_ID || "",
      },
    };
  }

  return manifest;
};

// Web Extension Configuration
const extensionConfig = {
  manifest: getManifest,
};

// Vite Configuration
const config = () => {
  const outDirTarget =
    "output/" + (target === "firefox" ? "dist-firefox" : "dist-chrome");
  return {
    root: resolve(__dirname, "src"),
    base: "./",
    publicDir: resolve(__dirname, "public"),
    build: {
      outDir: resolve(__dirname, outDirTarget),
      emptyOutDir: true,
      watch: process.env.WATCH === "true" ? {} : null,
    },
    plugins: [webExtension(extensionConfig)],
  };
};

// Export
export default defineConfig(() => config());
