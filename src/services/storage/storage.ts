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
