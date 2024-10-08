import { useEffect, useState } from "react";

import { SnapshotListItem } from "./SnapshotListItem";
import { tabs, storage } from "../../../services/";
import { getActiveSnapshotKey } from "../../../services/storage/storage";

export const SnapshotList = ({}) => {
  const [list, setList] = useState<Record<string, string>>({});
  const [active, setActive] = useState<null | string>(null);

  useEffect(() => {
    const getInitList = async () => {
      const tab = await tabs.activeTab();
      const st = (await storage.get([tab.url])) as Record<string, any>;
      const list = st[tab.url as string];

      list && setList(list);
    };

    const getInitActive = async () => {
      const key = await storage.getActiveSnapshotKey();
      const snapshot = (await storage.getActiveSnapshot()) as Record<string, any>;
      console.log("init active", snapshot);

      snapshot[key] && setActive(Object.keys(snapshot[key])[0]);
    };

    getInitList();
    getInitActive();
  }, []);

  useEffect(() => {
    // TODO: probably will be beater to move this logic into callback which we can pass in set storage fn
    async function updateList(stor: any) {
      const key = await getActiveSnapshotKey();

      if (!Object.keys(stor).includes(key)) {
        const newValue = (Object.values(stor)[0] as any).newValue as Record<string, string>;

        setList(newValue || {});
      }
    }

    storage.onChanged.addListener(updateList);

    return () => {
      storage.onChanged.removeListener(updateList);
    };
  }, []);

  const onDelete = async (snapshotID: string) => {
    const tab = await tabs.activeTab();

    if (tab.url) {
      const newList = Object.fromEntries(Object.entries(list).filter(([k, _]) => k != snapshotID));
      if (snapshotID == active) {
        await storage.removeActiveSnapshot(() => setActive(null));
      }

      await storage.set({
        [tab.url]: newList,
      });
    }
  };

  const onToggle = async (snapshotID: string, active: Boolean) => {
    console.log("toggle", active, snapshotID);

    if (active) {
      await storage.removeActiveSnapshot(() => setActive(null));
    } else {
      await storage.setActiveSnapshot({ [snapshotID]: list[snapshotID] }, () =>
        setActive(snapshotID)
      );
    }
  };

  return (
    <ul>
      <button
        onClick={async () => {
          const s = await chrome.storage.local.get();
          console.log("store ========> ", s);
        }}
      >
        get store
      </button>
      {Object.keys(list).map((snapshotID) => {
        return (
          <SnapshotListItem
            key={snapshotID}
            snapshotID={snapshotID}
            active={snapshotID === active}
            onClick={onToggle}
            onDelete={onDelete}
          />
        );
      })}
    </ul>
  );
};
