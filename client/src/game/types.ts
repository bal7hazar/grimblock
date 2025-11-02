import type { Piece, Orientation } from "@/types/piece";

export interface GridCell {
  filled: boolean;
  color?: string;
}

export interface GamePiece {
  piece: Piece;
  orientation: Orientation;
  blocks: boolean[][];
  subpack: number; // Piece identifier: orientation * 16 + piece
  id: string; // Unique identifier for React keys
}

export interface GameState {
  grid: GridCell[][];
  score: number;
  currentPieces: GamePiece[];
  selectedPieceIndex: number | null;
  gameOver: boolean;
}

export const GRID_SIZE = 8;

