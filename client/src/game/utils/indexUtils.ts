import { GRID_SIZE } from "../types";
import type { GamePiece } from "../types";

/**
 * Convert a single cell position (row, col) to bit index in the grid
 * Index starts at bottom-right (0), increments left, then up
 * 
 * Examples for 8x8 grid:
 * - Bottom-right (row=7, col=7) => index=0
 * - Bottom-left (row=7, col=0) => index=7
 * - Top-right (row=0, col=7) => index=56
 * - Top-left (row=0, col=0) => index=63
 */
function cellToGridIndex(row: number, col: number): number {
  return (GRID_SIZE - 1 - row) * GRID_SIZE + (GRID_SIZE - 1 - col);
}

/**
 * Convert piece placement position to grid_index for blockchain
 * The grid_index corresponds to where bit 0 of the piece will be placed in the grid
 * Bit 0 of the piece bitmap = bottom-right corner of the piece's bounding box
 * 
 * @param topLeftRow - Row of the top-left corner where piece is placed
 * @param topLeftCol - Column of the top-left corner where piece is placed
 * @param piece - The piece being placed
 * @returns The grid_index (bit position where piece bit 0 goes)
 */
export function positionToGridIndex(
  topLeftRow: number, 
  topLeftCol: number, 
  piece: GamePiece
): number {
  const { blocks } = piece;
  
  const pieceHeight = blocks.length;
  const pieceWidth = blocks[0]?.length || 0;
  
  // Bit 0 of the piece is at the bottom-right corner of its bounding box
  // Bottom = last row, Right = last column
  const bottomRightRow = topLeftRow + (pieceHeight - 1);
  const bottomRightCol = topLeftCol + (pieceWidth - 1);
  
  console.log('Piece dimensions:', pieceHeight, 'x', pieceWidth);
  console.log(`Top-left placement: (row=${topLeftRow}, col=${topLeftCol})`);
  console.log(`Bottom-right of piece: (row=${bottomRightRow}, col=${bottomRightCol})`);
  
  // Convert to grid index (bit 0 position)
  const index = cellToGridIndex(bottomRightRow, bottomRightCol);
  console.log(`Grid index (bit 0 position): ${index}`);
  
  // Verification: for bottom-right of grid (7,7), index should be 0
  if (bottomRightRow === 7 && bottomRightCol === 7) {
    console.log('✓ Piece placed at bottom-right corner, index should be 0');
  }
  
  return index;
}

/**
 * Convert grid_index from blockchain to grid position (row, col)
 * Reverse operation of positionToGridIndex
 */
export function gridIndexToPosition(index: number): { row: number; col: number } {
  const row = GRID_SIZE - 1 - Math.floor(index / GRID_SIZE);
  const col = GRID_SIZE - 1 - (index % GRID_SIZE);
  return { row, col };
}

