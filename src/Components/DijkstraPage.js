import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DijkstraPage.css';

const DijkstraPage = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [mode, setMode] = useState('');
  const [weights, setWeights] = useState({});
  const [numNodes, setNumNodes] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [pathsSet, setPathsSet] = useState(false);

  useEffect(() => {
    if (numNodes > 0) {
      generateNodes();
    }
  }, [numNodes]);

  const generateNodes = () => {
    const generatedNodes = [];
    for (let i = 0; i < numNodes; i++) {
      generatedNodes.push({ id: i, x: 0, y: 0 });
    }
    const arrangedNodes = arrangeNodes(generatedNodes);
    setNodes(arrangedNodes);
    setEdges([]);
    setWeights({});
    setPathsSet(false);
  };

  const arrangeNodes = (nodes) => {
    const numNodes = nodes.length;
    const centerX = 400;
    const centerY = 300;
    const radius = 200;

    if (numNodes === 2) {
      nodes[0].x = centerX - 100;
      nodes[0].y = centerY;
      nodes[1].x = centerX + 100;
      nodes[1].y = centerY;
    } else {
      for (let i = 0; i < numNodes; i++) {
        const angle = (2 * Math.PI * i) / numNodes;
        nodes[i].x = centerX + radius * Math.cos(angle);
        nodes[i].y = centerY + radius * Math.sin(angle);
      }
    }

    return nodes;
  };

  const handleNodeClick = (nodeId) => {
    if (mode === 'edge') {
      if (selectedNode === null) {
        setSelectedNode(nodeId);
      } else {
        if (selectedNode !== nodeId) {
          setEdges([...edges, [selectedNode, nodeId]]);
          setSelectedNode(null);
        } else {
          setSelectedNode(null);
        }
      }
    }
  };

  const handleGenerateWeights = () => {
    const weightsTable = {};
    edges.forEach(([node1, node2]) => {
      const key = `${node1}-${node2}`;
      if (!weightsTable[key]) {
        weightsTable[key] = 1;
      }
    });
    setWeights(weightsTable);
  };

  const handleWeightChange = (e, key) => {
    const value = parseInt(e.target.value, 10);
    setWeights({ ...weights, [key]: value });
  };

  const handleDone = () => {
    setPathsSet(true);
    setMode('');
  };

  return (
    <div className="dijkstra-page">
      <div className="controls">
        <input
          type="number"
          placeholder="Number of Nodes"
          value={numNodes}
          onChange={(e) => setNumNodes(parseInt(e.target.value, 10))}
        />
        <button onClick={generateNodes}>Generate Nodes</button>
        <button onClick={() => setMode('edge')} disabled={pathsSet}>Set Paths</button>
        <button onClick={handleDone} disabled={pathsSet}>Done</button>
        <button onClick={handleGenerateWeights} disabled={!pathsSet}>Place Weights</button>
      </div>
      <div className="graph">
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`node ${selectedNode === node.id ? 'selected' : ''}`}
            style={{ left: `${node.x}px`, top: `${node.y}px` }}
            onClick={() => handleNodeClick(node.id)}
          >
            {node.id}
          </div>
        ))}
        {edges.map(([node1, node2], index) => {
          const nodeA = nodes.find((node) => node.id === node1);
          const nodeB = nodes.find((node) => node.id === node2);
          if (!nodeA || !nodeB) return null; // Ensure nodes are defined
          return (
            <svg key={index} className="edge">
              <line
                x1={nodeA.x + 15}
                y1={nodeA.y + 15}
                x2={nodeB.x + 15}
                y2={nodeB.y + 15}
                stroke="black"
              />
            </svg>
          );
        })}
      </div>
      {Object.keys(weights).length > 0 && (
        <div className="weights-table">
          <table>
            <tbody>
              {Object.keys(weights).map((key) => (
                <tr key={key}>
                  <td>Weight of path {key.split('-').join(' to ')}</td>
                  <td>
                    <input
                      type="number"
                      value={weights[key]}
                      onChange={(e) => handleWeightChange(e, key)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DijkstraPage;
