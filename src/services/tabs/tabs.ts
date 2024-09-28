export const activeTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  return tab;
};

export const messageMakeSnapshot = async (tabId: number) => {
  return chrome.tabs.sendMessage(tabId as number, "makeSnapshot");
};
