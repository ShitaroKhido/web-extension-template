import browser from "webextension-polyfill";

document.getElementById("run-action").addEventListener("click", async () => {
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    if (!tab) throw new Error("No active tab");

    const response = await browser.tabs.sendMessage(tab.id, {
      type: "POPUP_ACTION",
      payload: { message: "Hello from popup!" },
    });

    document.getElementById("status").textContent = response?.message || "Message sent!";
  } catch (err) {
    document.getElementById("status").textContent = "Error: " + (err?.message || String(err));
  }
});
