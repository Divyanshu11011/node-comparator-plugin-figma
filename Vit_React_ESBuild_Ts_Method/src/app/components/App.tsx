import React, { useState, useEffect } from 'react';
import '../styles/ui.css'
const NodeComparator: React.FC = () => {
  const [node1Data, setNode1Data] = useState<any>({});
  const [node2Data, setNode2Data] = useState<any>({});

  useEffect(() => {
    onmessage = (event) => {
      const { type, node1, node2 } = event.data.pluginMessage;
      const updatedNode1Data = { ...node1Data };
      const updatedNode2Data = { ...node2Data };
      updatedNode1Data.propertiesOfNode1 = node1;
      updatedNode2Data.propertiesOfNode2 = node2;

      setNode1Data(updatedNode1Data);
      setNode2Data(updatedNode2Data);

      if (type === 'comparison-result') {
        const node1Element = document.getElementById('node1');
        const node2Element = document.getElementById('node2');

        if (node1Element) {
          node1Element.innerText = node1 ? JSON.stringify(node1, null, 4) : 'Select node 1 first';
          node1Element.style.backgroundColor = node1 ? 'white' : '#C4C4C4';
          node1Element.style.padding = node1 ? '2vh' : '0';
          node1Element.style.overflow = node1 ? 'scroll' : 'hidden';
        }

        if (node2Element) {
          node2Element.innerText = node2 ? JSON.stringify(node2, null, 4) : 'Select node 1 first';
          node2Element.style.backgroundColor = node2 ? 'white' : '#C4C4C4';
          node2Element.style.padding = node2 ? '2vh' : '0';
          node2Element.style.overflow = node2 ? 'scroll' : 'hidden';

          if (!node2) {
            node2Element.innerText = 'Now Select Node 2';
          }
        }
      }
    };
  }, []);

  const copyTextToClipboardNode1 = () => {
    const textArea = document.createElement('textarea');
    textArea.value = JSON.stringify(node1Data.propertiesOfNode1, null, 1);
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  };

  const copyTextToClipboardNode2 = () => {
    const textArea = document.createElement('textarea');
    textArea.value = JSON.stringify(node2Data.propertiesOfNode2, null, 1);
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  };

  return (
    <div>
      <h1>Node Comparing Plugin</h1>
      <div className="comparator">
        <div className="node1">
          <p>Node 1</p>
          <button id="copy-button-node-1" onClick={copyTextToClipboardNode1}>
            Copy
          </button>
          <pre id="node1" className="node-container">
            <span>node 1 first</span>
          </pre>
        </div>
        <div className="node2">
          <p>Node 2</p>
          <button id="copy-button-node-2" onClick={copyTextToClipboardNode2}>
            Copy
          </button>
          <pre id="node2" className="node-container">
            <span>node 1 first</span>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default NodeComparator;
