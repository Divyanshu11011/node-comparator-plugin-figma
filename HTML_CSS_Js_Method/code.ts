figma.showUI(__html__, { width: 600, height: 600 });

let selectedNode: SceneNode | null = null;

console.log("testing the nodetype " , selectedNode)

function updateUIWithNodeData() {
  if (selectedNode) {
    const nodeData = extractProperties(selectedNode);
    figma.ui.postMessage({ type: "node-data", nodeData });
  } else {
    figma.ui.postMessage({ type: "node-data", nodeData: null });
  }
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
  selectedNode = nodes.length > 0 ? nodes[0] : null;
  updateUIWithNodeData();
});

updateUIWithNodeData();
