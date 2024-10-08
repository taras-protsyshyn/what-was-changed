import { useEffect, useState } from "react";

import { storage } from "../services";
import { Popup } from "./components";

const parseHtmlStr = (htmlToCompare: string): Document => {
  const parser = new DOMParser();
  return parser.parseFromString(htmlToCompare, "text/html");
};

const compareTextContent = (
  acc: Array<[ChildNode, ChildNode]>,
  nodeA: ChildNode,
  nodeB: ChildNode
): Array<[ChildNode, ChildNode]> => {
  if ((!nodeA || !nodeB) && (nodeA?.nodeType === 1 || nodeB?.nodeType === 1)) {
    acc.push([nodeA, nodeB]);
    return acc;
  }

  if (
    nodeA?.nodeType !== 1 ||
    nodeB?.nodeType !== 1 ||
    nodeA.nodeName === "HEAD" ||
    nodeB.nodeName === "HEAD" ||
    nodeA.nodeName === "SCRIPT" ||
    nodeB.nodeName === "SCRIPT"
  ) {
    return acc;
  }

  // if (!nodeA || !nodeB) {
  //   acc.push([nodeA, nodeB]);
  //   return acc;
  // }

  if (
    nodeA.childNodes.length === 1 &&
    nodeB.childNodes.length === 1 &&
    nodeA.childNodes[0].nodeType === 3 &&
    nodeB.childNodes[0].nodeType === 3 &&
    nodeA.childNodes[0].textContent !== nodeB.childNodes[0].textContent
  ) {
    acc.push([nodeA, nodeB]);

    return acc;
  }

  const childrenA = nodeA.childNodes;
  const childrenB = nodeB.childNodes;
  const len = childrenA.length > childrenB.length ? childrenA.length : childrenB.length;

  for (let i = 0; i < len; i++) {
    compareTextContent(acc, childrenA[i], childrenB[i]);
  }

  return acc;
};

const compareDocumentWithCurrentDOM = (d: Document): Array<[ChildNode, ChildNode]> => {
  const acc = compareTextContent([], d.documentElement, document.documentElement);

  acc.forEach(([vEl, nodeEl], index) => {
    // here should be other logic for highlite the changed text adn show a popup with prev version
    if (nodeEl) {
      console.log("++++++++++++++++", nodeEl);

      (nodeEl as HTMLElement).setAttribute("data-wwc", index.toString());
    }
  });

  return acc;
};

const getDiff = (stor: Record<string, any>) => {
  console.log("stor =======>", stor);

  const entries = Object.entries(stor);

  if (entries.length === 0) return [];

  const [_, html] = entries[0];

  const d = parseHtmlStr(html);

  return compareDocumentWithCurrentDOM(d);
};

export const App = () => {
  const [diffs, setDiffs] = useState<Array<[ChildNode, ChildNode]>>([]);

  useEffect(() => {
    async function updateState(stor: any) {
      console.log("update storage  =============>", stor);
      const key = await storage.getActiveSnapshotKey();

      if (Object.keys(stor).includes(key)) {
        const newValue = stor[key].newValue as Record<string, string>;

        newValue && setDiffs(getDiff(newValue));
      }
    }

    const getInitActive = async () => {
      const snapshot = (await storage.getActiveSnapshot()) as Record<string, any>;

      snapshot && setDiffs(getDiff(snapshot));
    };

    getInitActive();
    storage.onChanged.addListener(updateState);

    return () => {
      storage.onChanged.removeListener(updateState);
    };
  }, []);

  console.log("diffs ============>", diffs);

  return <Popup />;
};
