export const activeTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  return tab;
};

export const EVENTS = {
  MAKE_SNAPSHOT: "MAKE_SNAPSHOT",
  SELECT_SNAPSHOT: "SELECT_SNAPSHOT",
};

export const messageMakeSnapshot = async (tabId: number) => {
  return chrome.tabs.sendMessage(tabId as number, EVENTS.MAKE_SNAPSHOT);
};

export const messageSelectSnapshot = async (tabId: number) => {
  return chrome.tabs.sendMessage(tabId as number, EVENTS.SELECT_SNAPSHOT);
};
