import { useEffect } from "react";

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
  console.log("function was runned ===============>", acc);

  if (nodeA.nodeType !== 1 || nodeB.nodeType !== 1) {
    return acc;
  }

  console.log(nodeA);
  console.log(nodeB);

  if (!nodeA || !nodeB) {
    acc.push([nodeA, nodeB]);
    return acc;
  }

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

  return acc;
};

export const App = () => {
  useEffect(() => {
    function updateState(stor: any) {
      console.log("update storage  =============>", stor);

      if (Object.keys(stor).includes(storage.ACTIVE_SNAPSHOT)) {
        const newValue = stor[storage.ACTIVE_SNAPSHOT].newValue as Record<string, string>;

        if (newValue) {
          const [snapshotID, html] = Object.entries(newValue)[0];

          compareDocumentWithCurrentDOM(parseHtmlStr(html));
        }
      }
    }

    storage.onChanged.addListener(updateState);
  }, []);

  return <Popup />;
};
