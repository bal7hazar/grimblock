import { Piece, PieceType, Orientation, OrientationType } from "@/types/piece";
import type { GamePiece } from "../types";
import { PIECE_COUNT, ORIENTATION_COUNT } from "@/types/piece";

export function bitmapToBlocks(bitmap: bigint, height: number, width: number): boolean[][] {
  const blocks: boolean[][] = Array.from({ length: height }, () => 
    Array.from({ length: width }, () => false)
  );
  
  // Read bitmap from right to left, bottom to top
  // Each row is 8 bits, we read from the least significant bits
  for (let row = 0; row < height; row++) {
    const shift = BigInt(row * 8); // Each row is 8 bits apart
    const rowBits = (bitmap >> shift) & 0xFFn; // Get 8 bits for this row
    
    for (let col = 0; col < width; col++) {
      // Check bit from right to left (LSB to MSB)
      const bitPos = BigInt(col);
      blocks[height - 1 - row][width - 1 - col] = ((rowBits >> bitPos) & 1n) === 1n;
    }
  }
  
  return blocks;
}

// Global counter for unique piece IDs (client-side only)
let globalPieceId = 0;

export function generateRandomPiece(): GamePiece {
  // Random piece type (1-14, excluding None)
  const pieceIndex = 1 + Math.floor(Math.random() * PIECE_COUNT);
  const pieceType = Object.values(PieceType)[pieceIndex] as PieceType;
  
  // Random orientation (1-4, excluding None)
  const orientationIndex = 1 + Math.floor(Math.random() * ORIENTATION_COUNT);
  const orientationType = Object.values(OrientationType)[orientationIndex] as OrientationType;
  
  const piece = new Piece(pieceType);
  const orientation = new Orientation(orientationType);
  
  const [height, width] = piece.size(orientation);
  const bitmap = piece.get(orientation);
  const blocks = bitmapToBlocks(bitmap, height, width);
  
  // Calculate subpack (piece identifier)
  const subpack = orientation.into() * 16 + piece.into();
  
  // Generate unique ID using global counter
  const id = `piece-${globalPieceId++}`;
  
  return {
    piece,
    orientation,
    blocks,
    subpack,
    id,
  };
}

export function generatePieces(count: number = 3): GamePiece[] {
  return Array.from({ length: count }, () => generateRandomPiece());
}

export function modelPieceToGamePiece(
  piece: Piece, 
  orientation: Orientation, 
  index: number,
  gameId: number
): GamePiece {
  const [height, width] = piece.size(orientation);
  const bitmap = piece.get(orientation);
  const blocks = bitmapToBlocks(bitmap, height, width);
  
  // Calculate subpack (piece identifier: orientation * 16 + piece)
  const subpack = orientation.into() * 16 + piece.into();
  
  // Generate truly unique ID (never reused)
  // Combines timestamp, random value, and counter
  const id = `piece-${globalPieceId++}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    piece,
    orientation,
    blocks,
    subpack,
    id,
  };
}

