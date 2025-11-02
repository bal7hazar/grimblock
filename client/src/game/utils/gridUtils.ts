import type { GridCell, GamePiece } from "../types";
import { GRID_SIZE } from "../types";

export function createEmptyGrid(): GridCell[][] {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ({ filled: false }))
  );
}

/**
 * Convert game model grid to visual grid state using isIdle method
 * Bit 0 = bottom-right (row=7, col=7)
 * Bit 63 = top-left (row=0, col=0)
 * All filled blocks are displayed in gray
 */
export function gameToGrid(game: { isIdle: (index: number) => boolean }): GridCell[][] {
  const grid = createEmptyGrid();
  
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      // Calculate bit index for this cell
      // Bottom-right = index 0, increments left then up
      const bitIndex = (GRID_SIZE - 1 - row) * GRID_SIZE + (GRID_SIZE - 1 - col);
      
      // Check if cell is occupied using game.isIdle()
      const isFilled = !game.isIdle(bitIndex);
      
      if (isFilled) {
        grid[row][col] = { 
          filled: true, 
          color: '#64748b' // Slate gray color for blockchain blocks
        };
      }
    }
  }
  
  return grid;
}

export function canPlacePiece(
  grid: GridCell[][],
  piece: GamePiece,
  row: number,
  col: number
): boolean {
  const { blocks } = piece;
  
  for (let i = 0; i < blocks.length; i++) {
    for (let j = 0; j < blocks[i].length; j++) {
      if (blocks[i][j]) {
        const gridRow = row + i;
        const gridCol = col + j;
        
        // Check bounds
        if (
          gridRow < 0 ||
          gridRow >= GRID_SIZE ||
          gridCol < 0 ||
          gridCol >= GRID_SIZE
        ) {
          return false;
        }
        
        // Check if cell is already filled
        if (grid[gridRow][gridCol].filled) {
          return false;
        }
      }
    }
  }
  
  return true;
}

export function placePiece(
  grid: GridCell[][],
  piece: GamePiece,
  row: number,
  col: number,
  color: string
): GridCell[][] {
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
  const { blocks } = piece;
  
  for (let i = 0; i < blocks.length; i++) {
    for (let j = 0; j < blocks[i].length; j++) {
      if (blocks[i][j]) {
        const gridRow = row + i;
        const gridCol = col + j;
        newGrid[gridRow][gridCol] = { filled: true, color };
      }
    }
  }
  
  return newGrid;
}

export function checkAndClearLines(grid: GridCell[][]): {
  newGrid: GridCell[][];
  linesCleared: number;
} {
  let newGrid = grid.map(row => row.map(cell => ({ ...cell })));
  let linesCleared = 0;
  
  // Check rows
  const rowsToClear: number[] = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    if (newGrid[i].every(cell => cell.filled)) {
      rowsToClear.push(i);
    }
  }
  
  // Check columns
  const colsToClear: number[] = [];
  for (let j = 0; j < GRID_SIZE; j++) {
    if (newGrid.every(row => row[j].filled)) {
      colsToClear.push(j);
    }
  }
  
  // Clear rows
  for (const row of rowsToClear) {
    for (let col = 0; col < GRID_SIZE; col++) {
      newGrid[row][col] = { filled: false };
    }
    linesCleared++;
  }
  
  // Clear columns
  for (const col of colsToClear) {
    for (let row = 0; row < GRID_SIZE; row++) {
      newGrid[row][col] = { filled: false };
    }
    linesCleared++;
  }
  
  return { newGrid, linesCleared };
}

export function hasValidMoves(
  grid: GridCell[][],
  pieces: GamePiece[]
): boolean {
  for (const piece of pieces) {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (canPlacePiece(grid, piece, row, col)) {
          return true;
        }
      }
    }
  }
  return false;
}

