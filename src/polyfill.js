import browser from "webextension-polyfill";

// Expose globally
if (typeof globalThis.browser === "undefined") {
  globalThis.browser = browser;
}
