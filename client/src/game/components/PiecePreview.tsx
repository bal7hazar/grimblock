import React from "react";
import type { GamePiece } from "../types";

interface PiecePreviewProps {
  piece: GamePiece;
  index: number;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
}

export const PiecePreview: React.FC<PiecePreviewProps> = ({
  piece,
  index,
  onDragStart,
  onDragEnd,
}) => {
  const { blocks } = piece;
  const color = piece.piece.color();
  const divRef = React.useRef<HTMLDivElement>(null);
  
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    
    // Find the first filled block to use as anchor point
    let anchorRow = 0;
    let anchorCol = 0;
    outerLoop: for (let r = 0; r < blocks.length; r++) {
      for (let c = 0; c < blocks[r].length; c++) {
        if (blocks[r][c]) {
          anchorRow = r;
          anchorCol = c;
          break outerLoop;
        }
      }
    }
    
    // Calculate offset to the anchor block (in pixels)
    const cellSize = 48; // w-12
    const gap = 4; // gap-1
    const offsetX = anchorCol * (cellSize + gap) + cellSize / 2;
    const offsetY = anchorRow * (cellSize + gap) + cellSize / 2;
    
    // Create a custom drag image
    if (divRef.current) {
      const dragImage = divRef.current.cloneNode(true) as HTMLElement;
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-9999px';
      document.body.appendChild(dragImage);
      
      e.dataTransfer.setDragImage(dragImage, offsetX, offsetY);
      
      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);
    }
    
    onDragStart(index);
  };
  
  return (
    <div
      ref={divRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className="cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-110"
    >
      <div 
        className="grid gap-1" 
        style={{ gridTemplateColumns: `repeat(${blocks[0]?.length || 1}, 1fr)` }}
      >
        {blocks.map((row, rowIndex) =>
          row.map((filled, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-12 h-12 rounded-md ${filled ? 'shadow-xl' : 'opacity-0 pointer-events-none'}`}
              style={{
                backgroundColor: filled ? color : 'transparent',
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

