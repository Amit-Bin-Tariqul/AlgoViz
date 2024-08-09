import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import './SortPage.css';
import BarChart from './BarChart';
import HeapChart from './HeapChart';

const SortPage = ({ endpoint, title }) => {
  const [initialArray, setInitialArray] = useState([]);
  const [iterations, setIterations] = useState([]);
  const [states, setStates] = useState([]);
  const [levels, setLevels] = useState([]);
  const [merged, setMerged] = useState([]);
  const [sortedArray, setSortedArray] = useState([]);
  const [pivots, setPivots] = useState([]); // Added pivots state
  const [swapPairs, setSwapPairs] = useState([]); // Added swapPairs state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState({
    swaps: 0,
    timeTaken: 0,
    timeComplexity: '',
    pros: [],
    cons: [],
    iterationsCount: 0
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const uniqueColors = useRef({}); // Use useRef to store colors

  useEffect(() => {
    axios.post(`https://algoviz-backend.onrender.com/api/${endpoint}`)
      .then(response => {
        const { initialArray, iterations, states, levels, merged, sortedArray, pivots, swapPairs, swaps, timeTaken, timeComplexity, pros, cons } = response.data;
        setInitialArray(initialArray || []);
        setIterations(iterations || []);
        setStates(states || []);
        setLevels(levels || []);
        setMerged(merged || []);
        setSortedArray(sortedArray || []);
        setPivots(pivots || []); // Set pivots from response
        setSwapPairs(swapPairs || []); // Set swapPairs from response
        setCurrentIndex(0);
        setStats({
          swaps: swaps || 0,
          timeTaken: timeTaken || 0,
          timeComplexity: timeComplexity || '',
          pros: pros || [],
          cons: cons || [],
          iterationsCount: (iterations && iterations.length) || 0
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [endpoint]);

  const handleNextIteration = () => {
    if (currentIndex < (endpoint === 'merge-sort' ? levels.length + merged.length - 1 : states.length - 1)) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreviousIteration = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRunSimulation = useCallback(() => {
    setIsSimulating(true);
    setIsPaused(false);
    setCurrentIndex(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (!isPaused && prevIndex < (endpoint === 'merge-sort' ? levels.length + merged.length - 1 : states.length - 1)) {
          return prevIndex + 1;
        } else if (!isPaused && prevIndex >= (endpoint === 'merge-sort' ? levels.length + merged.length - 1 : states.length - 1)) {
          clearInterval(intervalRef.current);
          setIsSimulating(false);
          return prevIndex;
        } else {
          return prevIndex;
        }
      });
    }, 500);
  }, [isPaused, endpoint, levels.length, merged.length, states.length]);

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  useEffect(() => {
    if (isPaused && intervalRef.current) {
      clearInterval(intervalRef.current);
    } else if (!isPaused && isSimulating) {
      handleRunSimulation();
    }
  }, [isPaused, handleRunSimulation, isSimulating]);

  const getColorForValue = (value) => {
    if (!uniqueColors.current[value]) {
      uniqueColors.current[value] = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`;
    }
    return uniqueColors.current[value];
  };

  const renderSubarrays = (levelData) => {
    return (
      <div className="subarrays">
        {levelData.arrays.map((subarray, index) => (
          <div key={index} className="subarray">
            <div className="array-container">
              {subarray.map((num, subIndex) => (
                <div key={subIndex} className="array-item">{num}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCurrentArray = () => {
    if (endpoint === 'merge-sort') {
      if (currentIndex < levels.length) {
        return levels.map((levelData, index) => (
          <div key={index} className="level-container">
            {renderSubarrays(levelData)}
          </div>
        )).slice(0, currentIndex + 1);
      } else {
        if (currentIndex === levels.length + merged.length - 1) {
          return (
            <div className="level-container">
              <div className="subarray">
                <div className="array-container">
                  {sortedArray.map((num, index) => (
                    <div key={index} className="array-item">{num}</div>
                  ))}
                </div>
              </div>
            </div>
          );
        } else {
          return merged.reverse().map((levelData, index) => (
            <div key={index} className="level-container">
              {renderSubarrays(levelData)}
            </div>
          )).slice(0, currentIndex - levels.length + 1);
        }
      }
    } else {
      return (
        <div className="array-container">
          {states.length > 0 && states[currentIndex] ? states[currentIndex].map((num, index) => (
            <div key={index} className="array-item">{num}</div>
          )) : null}
        </div>
      );
    }
  };

  return (
    <div className="sort-page">
      <h1>{title}</h1>
      <div>
        <h2>Original Array</h2>
        <div className="array-container">
          {initialArray.map((num, index) => (
            <div key={index} className="array-item">{num}</div>
          ))}
        </div>
      </div>
      {endpoint !== 'merge-sort' && (
        <div>
          <h2>Current Array State</h2>
          {renderCurrentArray()}
          <div className="iteration-buttons">
            <button onClick={handlePreviousIteration} disabled={currentIndex === 0 || isSimulating}>Previous Iteration</button>
            <button onClick={handleNextIteration} disabled={currentIndex >= (endpoint === 'merge-sort' ? levels.length + merged.length - 1 : states.length - 1) || isSimulating}>Next Iteration</button>
          </div>
        </div>
      )}
      <div>
        <h2>Sorted Array</h2>
        <div className="array-container">
          {iterations.length > 0 ? iterations[iterations.length - 1].map((num, index) => (
            <div key={index} className="array-item">{num}</div>
          )) : null}
        </div>
      </div>
      <div className="stats-container">
        <h2>Statistics</h2>
        <p><strong>Number of Iterations:</strong> {stats.iterationsCount}</p>
        <p><strong>Number of Swaps:</strong> {stats.swaps}</p>
        <p><strong>Approx Time Required:</strong> {stats.timeTaken.toFixed(2)} ms</p>
        <p><strong>Time Complexity:</strong> {stats.timeComplexity}</p>
        <h3>Pros:</h3>
        <ul>
          {stats.pros.map((pro, index) => (
            <li key={index}>{pro}</li>
          ))}
        </ul>
        <h3>Cons:</h3>
        <ul>
          {stats.cons.map((con, index) => (
            <li key={index}>{con}</li>
          ))}
        </ul>
      </div>
      <div className="simulation-container">
        <h2>Simulation</h2>
        {endpoint === 'heap-sort' ? (
          <HeapChart array={states[currentIndex] || initialArray} />
        ) : endpoint === 'quick-sort' ? (
          <BarChart 
            array={states[currentIndex] || initialArray} 
            algorithm={endpoint}
            pivot={pivots[currentIndex]}
            swaps={swapPairs[currentIndex]}
            getColorForValue={getColorForValue}
          />
        ) : endpoint === 'merge-sort' ? (
          <>
            {levels.map((levelData, index) => (
              <div key={index} className="level-container">
                {renderSubarrays(levelData)}
              </div>
            )).slice(0, currentIndex + 1)}
            {currentIndex >= levels.length && merged.reverse().map((levelData, index) => (
              <div key={index} className="level-container">
                {renderSubarrays(levelData)}
              </div>
            )).slice(0, currentIndex - levels.length + 1)}
          </>
        ) : (
          <BarChart 
            array={states[currentIndex] || initialArray} 
            algorithm={endpoint}
            getColorForValue={getColorForValue}
          />
        )}
        <div className="simulation-buttons">
          <button onClick={handleRunSimulation} disabled={isSimulating}>Run Simulation</button>
          <button onClick={handlePauseResume}>{isPaused ? 'Resume' : 'Pause'}</button>
        </div>
      </div>
    </div>
  );
};

export default SortPage;
