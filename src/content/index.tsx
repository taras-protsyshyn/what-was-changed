import { createRoot } from "react-dom/client";

import { tabs } from "../services";
import { App } from "./App";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request === tabs.EVENTS.MAKE_SNAPSHOT) {
    sendResponse({ href: document.location.href, html: document.documentElement.outerHTML });
  }
});

const element = document.createElement("div");
element.id = "what-was-change__root";
document.body.appendChild(element);

const root = createRoot(element as HTMLElement);

root.render(<App />);
