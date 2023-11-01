figma.showUI(__html__, { width: 1000, height: 600 });

let firstNode: SceneNode | null = null;
let secondNode: SceneNode | null = null;

function compareNodes() {
  const node1 = firstNode ? extractProperties(firstNode) : null;
  const node2 = secondNode ? extractProperties(secondNode) : null;

  figma.ui.postMessage({ type: "comparison-result", node1, node2 });
}

function extractProperties(node: any) {
  const result: any = {};
  for (const key in node) {
    if (typeof node[key] === "object" && !Array.isArray(node[key])) {
      result[key] = extractProperties(node[key]);
    } else {
      result[key] = node[key];
    }
  }
  return result;
}

figma.on("selectionchange", () => {
  const nodes = figma.currentPage.selection;
  const newFirstNode = nodes.length > 0 ? nodes[0] : null;
  const newSecondNode = nodes.length > 1 ? nodes[1] : null;
  if (firstNode != null) {
    secondNode = newFirstNode;
    compareNodes();
  } else if (newFirstNode !== firstNode || newSecondNode !== secondNode) {
    firstNode = newFirstNode;
    secondNode = newSecondNode;
    compareNodes();
  }
});

compareNodes();
