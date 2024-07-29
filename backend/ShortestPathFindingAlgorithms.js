const bfs = (grid, source, destination) => {
  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0]
  ];
  const queue = [[source.row, source.col]];
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const prev = Array.from({ length: rows }, () => Array(cols).fill(null));

  visited[source.row][source.col] = true;

  while (queue.length > 0) {
    const [currentRow, currentCol] = queue.shift();

    if (currentRow === destination.row && currentCol === destination.col) {
      return {
        path: reconstructPath(prev, destination),
        visitedCells: getVisitedCells(visited)
      };
    }

    for (const [dRow, dCol] of directions) {
      const newRow = currentRow + dRow;
      const newCol = currentCol + dCol;

      if (isValidMove(newRow, newCol, grid, visited)) {
        queue.push([newRow, newCol]);
        visited[newRow][newCol] = true;
        prev[newRow][newCol] = [currentRow, currentCol];
      }
    }
  }

  return { path: [], visitedCells: getVisitedCells(visited) };
};

const dfs = (grid, source, destination) => {
  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0]
  ];
  const stack = [[source.row, source.col]];
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const prev = Array.from({ length: rows }, () => Array(cols).fill(null));

  visited[source.row][source.col] = true;

  while (stack.length > 0) {
    const [currentRow, currentCol] = stack.pop();

    if (currentRow === destination.row && currentCol === destination.col) {
      return {
        path: reconstructPath(prev, destination),
        visitedCells: getVisitedCells(visited)
      };
    }

    for (const [dRow, dCol] of directions) {
      const newRow = currentRow + dRow;
      const newCol = currentCol + dCol;

      if (isValidMove(newRow, newCol, grid, visited)) {
        stack.push([newRow, newCol]);
        visited[newRow][newCol] = true;
        prev[newRow][newCol] = [currentRow, currentCol];
      }
    }
  }

  return { path: [], visitedCells: getVisitedCells(visited) };
};

// Helper functions
const isValidMove = (row, col, grid, visited) => {
  return (
    row >= 0 &&
    col >= 0 &&
    row < grid.length &&
    col < grid[0].length &&
    grid[row][col] === '' &&
    !visited[row][col]
  );
};

const reconstructPath = (prev, destination) => {
  const path = [];
  let [row, col] = [destination.row, destination.col];
  while (prev[row][col] !== null) {
    path.push([row, col]);
    [row, col] = prev[row][col];
  }
  path.push([row, col]);
  return path.reverse();
};

const getVisitedCells = (visited) => {
  const visitedCells = [];
  for (let row = 0; row < visited.length; row++) {
    for (let col = 0; col < visited[row].length; col++) {
      if (visited[row][col]) {
        visitedCells.push([row, col]);
      }
    }
  }
  return visitedCells;
};

const dijkstra = (nodes, edges, weights, source, destination) => {
  const adjList = {};
  nodes.forEach((node) => {
    adjList[node.id] = [];
  });

  edges.forEach(([node1, node2]) => {
    adjList[node1].push({ node: node2, weight: weights[`${node1}-${node2}`] || weights[`${node2}-${node1}`] });
    adjList[node2].push({ node: node1, weight: weights[`${node1}-${node2}`] || weights[`${node2}-${node1}`] });
  });

  const distances = {};
  const prev = {};
  const pq = new PriorityQueue((a, b) => distances[a] < distances[b]);

  nodes.forEach((node) => {
    distances[node.id] = Infinity;
    prev[node.id] = null;
  });

  distances[source] = 0;
  pq.enqueue(source);

  const visitedNodes = [];

  while (!pq.isEmpty()) {
    const currentNode = pq.dequeue();
    visitedNodes.push(currentNode);

    if (currentNode === destination) {
      const path = [];
      let temp = currentNode;
      while (temp !== null) {
        path.push(temp);
        temp = prev[temp];
      }
      return { path: path.reverse(), visitedCells: visitedNodes };
    }

    adjList[currentNode].forEach((neighbor) => {
      const alt = distances[currentNode] + neighbor.weight;
      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt;
        prev[neighbor.node] = currentNode;
        pq.enqueue(neighbor.node);
      }
    });
  }

  return { path: [], visitedCells: visitedNodes };
};

class PriorityQueue {
  constructor(compare) {
    this.compare = compare;
    this.data = [];
  }

  enqueue(item) {
    this.data.push(item);
    this.data.sort(this.compare);
  }

  dequeue() {
    return this.data.shift();
  }

  isEmpty() {
    return this.data.length === 0;
  }
}

module.exports = { bfs, dfs, dijkstra };
