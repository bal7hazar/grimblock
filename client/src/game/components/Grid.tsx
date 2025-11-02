import React from "react";
import type { GridCell, GamePiece } from "../types";
import { GRID_SIZE } from "../types";
import { canPlacePiece } from "../utils/gridUtils";

interface GridProps {
  grid: GridCell[][];
  selectedPiece: GamePiece | null;
  onDrop: (row: number, col: number) => void;
}

export const Grid: React.FC<GridProps> = ({ grid, selectedPiece, onDrop }) => {
  const [hoverCell, setHoverCell] = React.useState<{ row: number; col: number } | null>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  // Calculate grid position based on where the piece blocks would land
  const calculateHoverPosition = (e: React.DragEvent): { row: number; col: number } | null => {
    if (!gridRef.current || !selectedPiece) return null;

    const gridRect = gridRef.current.getBoundingClientRect();
    const cellSize = 48; // w-12
    const gap = 4; // gap-1
    const padding = 12; // p-3
    
    const { blocks } = selectedPiece;
    
    // Find the first filled block in the piece to use as anchor
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
    
    // Calculate which grid cell this anchor block is over
    // The cursor position represents where the anchor block is
    const anchorX = e.clientX;
    const anchorY = e.clientY;
    
    // Calculate grid position for the anchor
    const relX = anchorX - gridRect.left - padding;
    const relY = anchorY - gridRect.top - padding;
    
    // Find nearest cell center
    const anchorGridCol = Math.round((relX - cellSize / 2) / (cellSize + gap));
    const anchorGridRow = Math.round((relY - cellSize / 2) / (cellSize + gap));
    
    // Calculate top-left corner of the piece
    const topLeftRow = anchorGridRow - anchorRow;
    const topLeftCol = anchorGridCol - anchorCol;
    
    return { row: topLeftRow, col: topLeftCol };
  };

  const hoverPosition = React.useMemo(() => {
    return hoverCell;
  }, [hoverCell]);

  const canPlace = React.useMemo(() => {
    if (!selectedPiece || !hoverPosition) return false;
    return canPlacePiece(grid, selectedPiece, hoverPosition.row, hoverPosition.col);
  }, [grid, selectedPiece, hoverPosition]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const cell = calculateHoverPosition(e);
    if (cell) {
      setHoverCell(cell);
    }
  };

  const handleDragLeave = () => {
    setHoverCell(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (hoverPosition) {
      onDrop(hoverPosition.row, hoverPosition.col);
    }
    setHoverCell(null);
  };

  const isHoverBlock = (row: number, col: number): boolean => {
    if (!selectedPiece || !hoverPosition || !canPlace) return false;
    
    const { blocks } = selectedPiece;
    const relRow = row - hoverPosition.row;
    const relCol = col - hoverPosition.col;
    
    if (relRow >= 0 && relRow < blocks.length && relCol >= 0 && relCol < blocks[0].length) {
      return blocks[relRow][relCol];
    }
    
    return false;
  };

  return (
    <div 
      className="inline-block bg-slate-800/90 p-3 rounded-xl shadow-2xl"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div 
        ref={gridRef}
        className="grid gap-1" 
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isHover = isHoverBlock(rowIndex, colIndex);
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-12 h-12 rounded transition-all duration-100
                  ${cell.filled 
                    ? 'shadow-lg' 
                    : 'bg-slate-700/40'
                  }
                  ${isHover && canPlace ? 'ring-2 ring-green-400/70 bg-green-400/30 scale-95' : ''}
                  ${isHover && !canPlace ? 'ring-2 ring-red-500/70 bg-red-500/30' : ''}
                `}
                style={{
                  backgroundColor: cell.filled ? cell.color : undefined,
                  transition: 'background-color 400ms ease-in-out',
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

