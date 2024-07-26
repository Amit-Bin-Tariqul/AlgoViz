import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/bubble-sort" className="nav-link">Bubble Sort</Link>
      <Link to="/insertion-sort" className="nav-link">Insertion Sort</Link>
      <Link to="/selection-sort" className="nav-link">Selection Sort</Link>
      <Link to="/merge-sort" className="nav-link">Merge Sort</Link>
      <Link to="/quick-sort" className="nav-link">Quick Sort</Link>
      <Link to="/heap-sort" className="nav-link">Heap Sort</Link>
    </nav>
  );
}

export default Navbar;
