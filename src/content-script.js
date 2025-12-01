import browser from "webextension-polyfill";

// Minimal content script — listens for messages from popup/background and
// creates a transient visual highlight to demonstrate communication working.
function highlightPage(duration = 700) {
	try {
		// Avoid multiple highlights
		if (document.getElementById("ext-highlight")) {
			return;
		}

		const el = document.createElement("div");
		el.id = "ext-highlight";
		Object.assign(el.style, {
			position: "fixed",
			inset: "0",
			pointerEvents: "none",
			boxShadow: "inset 0 0 0 6px rgba(37,99,235,0.18)",
			zIndex: 2147483647,
			transition: "opacity 300ms ease",
			opacity: "1",
		});
		document.documentElement.appendChild(el);

		setTimeout(() => {
			el.style.opacity = "0";
			setTimeout(() => el.remove(), 300);
		}, duration);
	} catch (e) {
		// ignore errors — we don't want to break the page DOM
	}
}

browser.runtime.onMessage.addListener((message) => {
	try {
		if (message && message.type === "POPUP_ACTION") {
			console.log("Received POPUP_ACTION:", message.payload || {});
			highlightPage();
			return Promise.resolve({ ok: true, message: "highlighted" });
		}
	} catch (e) {
		// Keep content script silent on errors
	}
});
