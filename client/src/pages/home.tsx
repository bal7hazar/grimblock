import { useState } from "react";
import { Header } from "@/components/header";
import { LeaderboardModal } from "@/components/LeaderboardModal";
import { GameBoard, PieceShapesModal } from "@/game";

export const Home = () => {
  const [showPieceDebug, setShowPieceDebug] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <div className="w-full h-full overflow-y-auto">
      <Header 
        onShowPieceShapes={() => setShowPieceDebug(true)}
        onShowLeaderboard={() => setShowLeaderboard(true)}
      />
      
      {/* Leaderboard Modal */}
      <LeaderboardModal 
        isOpen={showLeaderboard} 
        onClose={() => setShowLeaderboard(false)} 
      />
      
      {/* Piece Shapes Modal */}
      <PieceShapesModal 
        isOpen={showPieceDebug} 
        onClose={() => setShowPieceDebug(false)} 
      />
      
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <GameBoard />
      </div>
    </div>
  );
};