const dfs = (grid, start, end) => {
  const [startRow, startCol] = start;
  const [endRow, endCol] = end;
  const stack = [[startRow, startCol, []]];
  const visited = new Set();
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
  ];
  const visitedCells = []; // Track visited cells

  while (stack.length > 0) {
    const [row, col, path] = stack.pop();
    if (row === endRow && col === endCol) {
      return { path: path.concat([[row, col]]), visitedCells };
    }

    for (let [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;
      const newPath = path.concat([[row, col]]);
      if (
        newRow >= 0 &&
        newRow < grid.length &&
        newCol >= 0 &&
        newCol < grid[0].length &&
        grid[newRow][newCol] !== 'W' &&
        !visited.has(`${newRow}-${newCol}`)
      ) {
        visited.add(`${newRow}-${newCol}`);
        visitedCells.push([newRow, newCol]); // Add to visited cells
        stack.push([newRow, newCol, newPath]);
      }
    }
  }
  return { path: null, visitedCells };
};

export default dfs;
