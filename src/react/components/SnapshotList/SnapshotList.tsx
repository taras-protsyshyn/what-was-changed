import { useEffect, useState } from "react";

import { SnapshotListItem } from "./SnapshotListItem";
import { tabs, storage } from "../../../services/";

export const SnapshotList = ({}) => {
  const [list, setList] = useState<Record<string, string>>({});

  useEffect(() => {
    const getInitList = async () => {
      const tab = await tabs.activeTab();
      const st = (await storage.get([tab.url])) as Record<string, any>;
      const list = st[tab.url as string];

      list && setList(list);
    };

    getInitList();
  }, []);

  useEffect(() => {
    function updateState(storage: any) {
      const newValue = (Object.values(storage)[0] as any).newValue as Record<string, string>;

      setList(newValue || {});
    }

    storage.onChanged.addListener(updateState);

    return () => {
      storage.onChanged.removeListener(updateState);
    };
  }, []);

  const onDelete = async (snapshotID: string) => {
    const tab = await tabs.activeTab();
    if (tab.url) {
      const newList = Object.fromEntries(Object.entries(list).filter(([k, _]) => k != snapshotID));

      await storage.set({
        [tab.url]: newList,
      });
    }
  };

  return (
    <ul>
      {Object.keys(list).map((snapshotID) => {
        return (
          <SnapshotListItem
            key={snapshotID}
            snapshotID={snapshotID}
            onClick={(id) => console.log("snapshot was clicked => ", id)}
            onDelete={onDelete}
          />
        );
      })}
    </ul>
  );
};
