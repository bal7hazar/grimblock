import { Piece, PieceType, Orientation, OrientationType } from "@/types/piece";
import { bitmapToBlocks } from "../utils/pieceUtils";

export const PieceDebug: React.FC = () => {
  const pieces = [
    PieceType.Domino,
    PieceType.Triomino,
    PieceType.Corner,
    PieceType.Hero,
    PieceType.Smashboy,
    PieceType.Tallboy,
    PieceType.Teewee,
    PieceType.LargeCorner,
    PieceType.BlueRicky,
    PieceType.OrangeRicky,
    PieceType.ClevelandZ,
    PieceType.RhodeIsland,
    PieceType.SuperHero,
    PieceType.BigBoy,
  ];

  const orientations = [
    OrientationType.Up,
    OrientationType.Right,
    OrientationType.Down,
    OrientationType.Left,
  ];

  return (
    <div className="text-white">
      {pieces.map((pieceType) => {
        const piece = new Piece(pieceType);
        
        return (
          <div key={pieceType} className="mb-8 bg-slate-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
              {piece.name()} - Score: {piece.score()}
            </h2>
            
            <div className="flex gap-8 flex-wrap">
              {orientations.map((orientationType) => {
                const orientation = new Orientation(orientationType);
                const [height, width] = piece.size(orientation);
                const bitmap = piece.get(orientation);
                const blocks = bitmapToBlocks(bitmap, height, width);
                const color = piece.color();

                return (
                  <div key={orientationType} className="flex flex-col items-center gap-2">
                    <div className="text-sm text-white/60">{orientation.name()}</div>
                    <div className="text-xs text-white/40">
                      {height}×{width}
                    </div>
                    <div 
                      className="grid gap-1 bg-slate-700/50 p-3 rounded"
                      style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}
                    >
                      {blocks.map((row, rowIndex) =>
                        row.map((filled, colIndex) => (
                          <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`w-8 h-8 rounded ${filled ? '' : 'bg-slate-600/30'}`}
                            style={{
                              backgroundColor: filled ? color : undefined,
                            }}
                          />
                        ))
                      )}
                    </div>
                    <div className="text-xs font-mono text-white/30">
                      0b{bitmap.toString(2).padStart(height * 8, '0')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

