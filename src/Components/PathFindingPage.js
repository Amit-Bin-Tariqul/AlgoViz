import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './PathFindingPage.css';

const PathFindingPage = ({ algorithm }) => {
  const [grid, setGrid] = useState(createGrid(10, 10));
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [mode, setMode] = useState(''); // 'source', 'destination', 'wall'
  const [path, setPath] = useState([]);
  const [visitedCells, setVisitedCells] = useState([]);
  const intervalRef = useRef(null);

  const resetGrid = useCallback(() => {
    setGrid(createGrid(10, 10));
    setSource(null);
    setDestination(null);
    setPath([]);
    setVisitedCells([]);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []); // No dependencies needed for resetGrid

  useEffect(() => {
    resetGrid();
  }, [algorithm, resetGrid]); // Include resetGrid as a dependency

  function createGrid(rows, cols) {
    return Array.from({ length: rows }, () => Array(cols).fill(''));
  }

  const handleCellClick = (row, col) => {
    if (mode === 'source') {
      setSource({ row, col });
    } else if (mode === 'destination') {
      setDestination({ row, col });
    } else if (mode === 'wall') {
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(row => [...row]);
        newGrid[row][col] = newGrid[row][col] === 'W' ? '' : 'W';
        return newGrid;
      });
    }
  };

  const handleFindPath = () => {
    if (!source || !destination) {
      alert("Please select both source and destination.");
      return;
    }

    axios.post(`http://localhost:3000/api/shortest-path/${algorithm}`, {
      grid,
      source,
      destination
    }).then(response => {
      const { path, visitedCells } = response.data;
      animateVisitedCells(visitedCells, path);
    }).catch(error => {
      console.error('Error finding path:', error);
    });
  };

  const animateVisitedCells = (visitedCells, path) => {
    setVisitedCells([]);
    visitedCells.forEach((cell, index) => {
      setTimeout(() => {
        setVisitedCells(prevVisited => [...prevVisited, cell]);
        if (index === visitedCells.length - 1) {
          setTimeout(() => {
            setPath(path);
          }, 20); // Reduce this to 20ms from 200ms for 10x speed
        }
      }, index * 50); // Reduce this to 50ms from 500ms for 10x speed
    });
  };

  useEffect(() => {
    const currentInterval = intervalRef.current; // Capture the current ref value
    return () => {
      if (currentInterval) {
        clearInterval(currentInterval);
      }
    };
  }, []); // No dependencies needed here

  return (
    <div className="pathfinding-page">
      <div className="controls">
        <button onClick={() => setMode('source')}>Select Source</button>
        <button onClick={() => setMode('destination')}>Select Destination</button>
        <button onClick={() => setMode('wall')}>Place Wall</button>
      </div>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => {
              const isSource = source && source.row === rowIndex && source.col === colIndex;
              const isDestination = destination && destination.row === rowIndex && destination.col === colIndex;
              const isWall = cell === 'W';
              const isVisited = visitedCells.some(([r, c]) => r === rowIndex && c === colIndex);
              const isPath = path.some(([r, c]) => r === rowIndex && c === colIndex);

              return (
                <div
                  key={colIndex}
                  className={`cell ${isSource ? 'source' : ''} ${isDestination ? 'destination' : ''} ${isWall ? 'wall' : ''} ${isVisited ? 'visited' : ''} ${isPath ? 'path' : ''}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                />
              );
            })}
          </div>
        ))}
      </div>
      <button onClick={handleFindPath} className="find-path-button">Find Path</button>
    </div>
  );
};

export default PathFindingPage;
