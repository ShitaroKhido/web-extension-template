import browser from "webextension-polyfill";

browser.runtime.onInstalled.addListener(() => {
  console.log("Installed!");
});

// Minimal message handler — useful for debugging or background actions
browser.runtime.onMessage.addListener((message, sender) => {
  if (message && message.type === "PING") {
    return Promise.resolve({ pong: true });
  }
});
