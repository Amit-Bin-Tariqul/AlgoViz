function bubbleSort(array) {
  let iterations = [];
  let states = [];
  let len = array.length;
  let swaps = 0;
  let startTime = performance.now();

  let arr = [...array];
  states.push([...arr]); // Initial state

  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swaps++;
        states.push([...arr]);
      }
    }
    iterations.push([...arr]);
  }

  let endTime = performance.now();
  return {
    iterations,
    states,
    swaps,
    timeTaken: endTime - startTime,
    timeComplexity: "O(n^2)",
    pros: ["Simple to implement", "Good for small datasets"],
    cons: ["Inefficient on large datasets", "Too many swaps"]
  };
}

function insertionSort(array) {
  let iterations = [];
  let states = [];
  let len = array.length;
  let swaps = 0;
  let startTime = performance.now();

  let arr = [...array];
  states.push([...arr]); // Initial state

  for (let i = 1; i < len; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
      swaps++;
      states.push([...arr]);
    }
    arr[j + 1] = key;
    states.push([...arr]);
    iterations.push([...arr]);
  }

  let endTime = performance.now();
  return {
    iterations,
    states,
    swaps,
    timeTaken: endTime - startTime,
    timeComplexity: "O(n^2)",
    pros: ["Simple implementation", "Efficient for small data sets"],
    cons: ["Inefficient for large data sets", "Not suitable for large datasets"]
  };
}

function selectionSort(array) {
  let iterations = [];
  let states = [];
  let len = array.length;
  let swaps = 0;
  let startTime = performance.now();

  let arr = [...array];
  states.push([...arr]); // Initial state

  for (let i = 0; i < len - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      let temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;
      swaps++;
      states.push([...arr]);
    }
    iterations.push([...arr]);
  }

  let endTime = performance.now();
  return {
    iterations,
    states,
    swaps,
    timeTaken: endTime - startTime,
    timeComplexity: "O(n^2)",
    pros: ["Simple implementation", "Less swapping than bubble sort"],
    cons: ["Inefficient for large data sets", "High time complexity"]
  };
}

function mergeSort(array) {
  let iterations = [];
  let states = [];
  let levels = [];
  let merged = [];
  let startTime = performance.now();
  let swaps = 0;

  function mergeSortHelper(arr, depth) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSortHelper(arr.slice(0, mid), depth + 1);
    const right = mergeSortHelper(arr.slice(mid), depth + 1);

    const mergedArr = merge(left, right);

    if (!levels[depth]) {
      levels[depth] = { level: depth, arrays: [] };
    }
    levels[depth].arrays.push([...arr]);

    if (depth > 0) {
      if (!merged[depth - 1]) {
        merged[depth - 1] = { level: depth - 1, arrays: [] };
      }
      merged[depth - 1].arrays.push([...mergedArr]);
    }

    return mergedArr;
  }

  function merge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] < right[rightIndex]) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
        swaps++;
      }
    }

    result = result.concat(left.slice(leftIndex), right.slice(rightIndex));
    iterations.push([...result]);
    return result;
  }

  mergeSortHelper(array, 0);
  let endTime = performance.now();

  return {
    iterations,
    states,
    levels,
    merged,
    swaps,
    timeTaken: endTime - startTime,
    timeComplexity: "O(n log n)",
    pros: ["Efficient for large datasets", "Stable sort"],
    cons: ["Uses additional memory", "Complex implementation"]
  };
}

function quickSort(array) {
  let iterations = [];
  let states = [];
  let pivots = [];
  let swapPairs = [];
  let startTime = performance.now();

  function quickSortHelper(arr, low, high) {
    if (low < high) {
      let pi = partition(arr, low, high);

      quickSortHelper(arr, low, pi - 1);
      quickSortHelper(arr, pi + 1, high);
    }
  }

  function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;
    pivots.push(high);

    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        swapPairs.push([i, j]);
        states.push([...arr]);
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    swapPairs.push([i + 1, high]);
    states.push([...arr]);
    return i + 1;
  }

  let arr = [...array];
  quickSortHelper(arr, 0, arr.length - 1);
  let endTime = performance.now();

  iterations.push([...arr]); // Store the final sorted array
  return {
    iterations,
    states,
    pivots,
    swapPairs,
    timeTaken: endTime - startTime,
    timeComplexity: "O(n log n)",
    pros: ["Efficient for large datasets", "In-place sorting"],
    cons: ["Unstable sort", "Worst case time complexity is O(n^2)"]
  };
}


function heapSort(array) {
  let iterations = [];
  let states = [];
  let len = array.length;
  let swaps = 0;
  let startTime = performance.now();

  let arr = [...array];

  for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
    heapify(arr, len, i);
  }

  for (let i = len - 1; i > 0; i--) {
    let temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;
    swaps++;
    states.push([...arr]);
    heapify(arr, i, 0);
    iterations.push([...arr]);
  }

  function heapify(arr, len, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < len && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < len && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      let temp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = temp;
      swaps++;
      heapify(arr, len, largest);
    }
  }

  let endTime = performance.now();
  return {
    iterations,
    states,
    swaps,
    timeTaken: endTime - startTime,
    timeComplexity: "O(n log n)",
    pros: ["Efficient for large datasets", "In-place sorting"],
    cons: ["Not stable", "Complex implementation"]
  };
}

module.exports = {
  bubbleSort,
  insertionSort,
  selectionSort,
  mergeSort,
  quickSort,
  heapSort,
};
