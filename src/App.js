import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import BubbleSort from './Pages/BubbleSort';
import InsertionSort from './Pages/InsertionSort';
import SelectionSort from './Pages/SelectionSort';
import MergeSort from './Pages/MergeSort';
import QuickSort from './Pages/QuickSort';
import HeapSort from './Pages/HeapSort';
import PathFindingPage from './Components/PathFindingPage';
import DijkstraPage from './Components/DijkstraPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="text-center">
          <Navbar />
          <h1 className="algoviz-title">ALGOVIZ</h1>
          <h2 className="algoviz-subtitle">A Sorting Algorithm Visualizer for Grasping Concepts</h2>
        </header>
        <Routes>
          <Route path="/bubble-sort" element={<BubbleSort />} />
          <Route path="/insertion-sort" element={<InsertionSort />} />
          <Route path="/selection-sort" element={<SelectionSort />} />
          <Route path="/merge-sort" element={<MergeSort />} />
          <Route path="/quick-sort" element={<QuickSort />} />
          <Route path="/heap-sort" element={<HeapSort />} />
          <Route path="/bfs" element={<PathFindingPage algorithm="bfs" />} />
          <Route path="/dfs" element={<PathFindingPage algorithm="dfs" />} />
          <Route path="/dijkstra" element={<DijkstraPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
