import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import BarChart from './BarChart';
import HeapChart from './HeapChart';
import './SortPage.css';

const SortPage = ({ endpoint, title }) => {
  const [initialArray, setInitialArray] = useState([]);
  const [iterations, setIterations] = useState([]);
  const [states, setStates] = useState([]);
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

  useEffect(() => {
    axios.post(`http://localhost:3000/api/${endpoint}`)
      .then(response => {
        const { initialArray, iterations, states, swaps, timeTaken, timeComplexity, pros, cons } = response.data;
        setInitialArray(initialArray || []);
        setIterations(iterations || []);
        setStates(states || []);
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
    if (currentIndex < states.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreviousIteration = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setIsPaused(false);
    setCurrentIndex(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (!isPaused && prevIndex < states.length - 1) {
          return prevIndex + 1;
        } else if (!isPaused && prevIndex >= states.length - 1) {
          clearInterval(intervalRef.current);
          setIsSimulating(false);
          return prevIndex;
        } else {
          return prevIndex;
        }
      });
    }, 500);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  useEffect(() => {
    if (isPaused && intervalRef.current) {
      clearInterval(intervalRef.current);
    } else if (!isPaused && isSimulating) {
      handleRunSimulation();
    }
  }, [isPaused]);

  const renderSubarrays = (state) => {
    if (endpoint === 'merge-sort') {
      return (
        <div className="subarrays">
          {state.left && (
            <div className="subarray">
              <div className="array-container">
                {state.left.map((num, index) => (
                  <div key={index} className="array-item">{num}</div>
                ))}
              </div>
              <div>↓</div>
            </div>
          )}
          {state.right && (
            <div className="subarray">
              <div className="array-container">
                {state.right.map((num, index) => (
                  <div key={index} className="array-item">{num}</div>
                ))}
              </div>
              <div>↓</div>
            </div>
          )}
          {state.result && (
            <div className="subarray">
              <div className="array-container">
                {state.result.map((num, index) => (
                  <div key={index} className="array-item">{num}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    } else if (endpoint === 'quick-sort') {
      return (
        <div className="subarrays">
          {state.left && (
            <div className="subarray">
              <div className="array-container">
                {state.left.map((num, index) => (
                  <div key={index} className="array-item">{num}</div>
                ))}
              </div>
              <div>↓</div>
            </div>
          )}
          {state.pivot !== undefined && (
            <div className="subarray">
              <div className="array-container">{state.pivot}</div>
              <div>↓</div>
            </div>
          )}
          {state.right && (
            <div className="subarray">
              <div className="array-container">
                {state.right.map((num, index) => (
                  <div key={index} className="array-item">{num}</div>
                ))}
              </div>
            </div>
          )}
          {state.array && (
            <div className="subarray">
              <div className="array-container">
                {state.array.map((num, index) => (
                  <div key={index} className="array-item">{num}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderCurrentArray = () => {
    return (
      <div className="array-container">
        {iterations.length > 0 && iterations[currentIndex] ? iterations[currentIndex].map((num, index) => (
          <div key={index} className="array-item">{num}</div>
        )) : null}
      </div>
    );
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
      <div>
        <h2>Current Array State</h2>
        {renderCurrentArray()}
        <div className="iteration-buttons">
          <button onClick={handlePreviousIteration} disabled={currentIndex === 0 || isSimulating}>Previous Iteration</button>
          <button onClick={handleNextIteration} disabled={currentIndex >= states.length - 1 || isSimulating}>Next Iteration</button>
        </div>
      </div>
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
        ) : endpoint === 'quick-sort' || endpoint === 'merge-sort' ? (
          renderSubarrays(states[currentIndex] || {})
        ) : (
          <BarChart array={states[currentIndex] || initialArray} />
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
