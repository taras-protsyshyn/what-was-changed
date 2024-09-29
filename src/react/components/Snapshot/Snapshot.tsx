import { storage, tabs, time } from "../../../services";

export const Snapshot = () => {
  const makeSnapshot = async () => {
    const tab = await tabs.activeTab();

    const res = (await tabs.messageMakeSnapshot(tab.id as number)) as {
      href: string;
      html: string;
    };

    const oldState = await storage.get([res.href]);
    const entries = Object.entries(oldState[res.href] || {}) as Array<[string, string]>;

    let newState: Record<string, string> = {};
    let cashed = false;

    if (entries.length > 0) {
      for (const [k, v] of entries) {
        // if nothing was changed and time from last snapshot is les than one day,
        // jus rewrite a time(key) for existing record
        if (v == res.html && time.diffInDays({ from: k }) < 1) {
          newState[time.getTime()] = res.html;
          cashed = true;
          continue;
        }

        newState[k] = v;
      }
    }

    if (!cashed) {
      newState[time.getTime()] = res.html;
    }

    await storage.set({
      [res.href]: newState,
    });
  };

  return (
    <>
      <button onClick={() => storage.clear()}>Clear All</button>
      <button onClick={makeSnapshot}>Make a Snapshot</button>
    </>
  );
};
