import { tabs, storage } from "../services";

console.log("test =========================>");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request === tabs.EVENTS.MAKE_SNAPSHOT) {
    sendResponse({ href: document.location.href, html: document.documentElement.outerHTML });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request === tabs.EVENTS.SELECT_SNAPSHOT) {
    sendResponse({ href: document.location.href, html: document.documentElement.outerHTML });
  }
});

function updateState(stor: any) {
  console.log("update storage  =============>", stor);

  if (!Object.keys(stor).includes(storage.ACTIVE_SNAPSHOT)) {
    const newValue = (Object.values(stor)[0] as any).newValue as Record<string, string>;
  }
}

storage.onChanged.addListener(updateState);
