const express = require('express');
const cors = require('cors');
const { bubbleSort, insertionSort, selectionSort, mergeSort, quickSort, heapSort } = require('./SortingAlgorithms');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

let initialArray = generateRandomArray();
let iterations = {
  "bubble-sort": {},
  'insertion-sort': {},
  'selection-sort': {},
  'merge-sort': {},
  'quick-sort': {},
  'heap-sort': {}
};

function generateRandomArray() {
  const randomArray = [];
  const availableNumbers = new Set();
  while (availableNumbers.size < 8) {
    availableNumbers.add(Math.floor(Math.random() * 50) + 1);
  }
  return Array.from(availableNumbers);
}

function generateIterations() {
  iterations['bubble-sort'] = bubbleSort([...initialArray]);
  iterations['insertion-sort'] = insertionSort([...initialArray]);
  iterations['selection-sort'] = selectionSort([...initialArray]);
  iterations['merge-sort'] = mergeSort([...initialArray]);
  iterations['quick-sort'] = quickSort([...initialArray]);
  iterations['heap-sort'] = heapSort([...initialArray]);
}

generateIterations();

app.post('/api/:algorithm', (req, res) => {
  const algorithm = req.params.algorithm;
  if (iterations[algorithm]) {
    res.json({ initialArray, ...iterations[algorithm], iterations: iterations[algorithm].iterations || [], states: iterations[algorithm].states || [], levels: iterations[algorithm].levels || [] });
  } else {
    res.status(400).json({ error: 'Invalid algorithm' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
