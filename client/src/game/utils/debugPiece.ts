import { Piece, PieceType, Orientation, OrientationType } from "@/types/piece";
import { bitmapToBlocks } from "./pieceUtils";

// Test function to understand bitmap to blocks conversion
export function testBitmapConversion() {
  const piece = new Piece(PieceType.Domino);
  const orientation = new Orientation(OrientationType.Up);
  
  const bitmap = piece.get(orientation);
  const [height, width] = piece.size(orientation);
  const blocks = bitmapToBlocks(bitmap, height, width);
  
  console.log('=== Domino Up Test ===');
  console.log('Bitmap:', '0b' + bitmap.toString(2).padStart(16, '0'));
  console.log('Size:', height, 'x', width);
  console.log('Blocks array:');
  blocks.forEach((row, r) => {
    console.log(`  Row ${r}:`, row.map(b => b ? '1' : '0').join(' '));
  });
  
  // Test which block position corresponds to bit 0
  console.log('\nBit 0 should be at blocks[' + (height - 1) + '][' + (width - 1) + ']');
  console.log('Value:', blocks[height - 1][width - 1]);
}

