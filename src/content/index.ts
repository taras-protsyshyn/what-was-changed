console.log("test =========================>");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request, sender);

  sendResponse({ href: document.location.href, html: document.documentElement.outerHTML });
});
