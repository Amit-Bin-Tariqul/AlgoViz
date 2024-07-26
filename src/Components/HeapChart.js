import React from 'react';
import './HeapChart.css';

const HeapChart = ({ array }) => {
  const renderHeap = (arr) => {
    const levels = [];
    let level = 0;
    let nextIndex = 0;
    while (nextIndex < arr.length) {
      const levelSize = 2 ** level;
      levels.push(arr.slice(nextIndex, nextIndex + levelSize));
      nextIndex += levelSize;
      level++;
    }
    return levels;
  };

  const levels = renderHeap(array);

  return (
    <div className="heap-chart">
      {levels.map((level, index) => (
        <div key={index} className="heap-level">
          {level.map((num, i) => (
            <div key={i} className="heap-node">{num}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default HeapChart;
