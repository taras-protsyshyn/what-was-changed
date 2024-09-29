type NoInferX<T> = T[][T extends any ? 0 : never];

export const set = async (val: { [key: string]: any }, cb?: () => void): Promise<void> => {
  await chrome.storage.local.set(val, cb || function () {});
};

export const get = async <T = { [key: string]: any }>(
  keys: NoInferX<T> | Array<NoInferX<keyof T>> | Partial<NoInferX<T>> | null
): Promise<T> => {
  return chrome.storage.local.get<T>(keys);
};

export const clear = async () => chrome.storage.local.clear();

export const onChanged = chrome.storage.local.onChanged;

// work with selected snapshot

export const ACTIVE_SNAPSHOT = "ACTIVE_SNAPSHOT";

export const getActiveSnapshot = async () => {
  return chrome.storage.local.get([ACTIVE_SNAPSHOT]);
};

export const setActiveSnapshot = async (val: Record<string, string> | null, cb?: () => void) => {
  return chrome.storage.local.set({ [ACTIVE_SNAPSHOT]: val }, cb || function () {});
};

export const removeActiveSnapshot = async (cb?: () => void) => {
  return chrome.storage.local.remove(ACTIVE_SNAPSHOT, cb || function () {});
};
