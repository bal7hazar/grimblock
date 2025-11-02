import React, { useState, useMemo } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEntities } from "@/contexts/entities";

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ITEMS_PER_PAGE = 8;

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const { games, getPlayerById } = useEntities();
  const [currentPage, setCurrentPage] = useState(0);

  // Sort games by score (highest first)
  const sortedGames = useMemo(() => {
    if (!games) return [];
    return [...games]
      .filter(game => game.exists())
      .sort((a, b) => b.score - a.score);
  }, [games]);

  const totalPages = Math.ceil(sortedGames.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const paginatedGames = sortedGames.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-8"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 rounded-2xl shadow-2xl border border-white/10 max-w-4xl min-h-[770px] w-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-white">Leaderboard</h2>
            <div className="text-sm text-white/60 bg-white/5 px-3 py-1 rounded-full">
              {sortedGames.length} games
            </div>
          </div>
          <Button
            variant="secondary"
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto p-6">
          {sortedGames.length === 0 ? (
            <div className="text-center text-white/60 py-12">
              <p className="text-xl">No games yet!</p>
              <p className="text-sm mt-2">Be the first to play and set a high score.</p>
            </div>
          ) : (
            <table className="w-full text-lg tracking-wider">
              <thead>
                <tr className="text-left border-b border-white/10 font-light">
                  <th className="pb-3 text-white/60">Rank</th>
                  <th className="pb-3 text-white/60">Game ID</th>
                  <th className="pb-3 text-white/60">Player</th>
                  <th className="pb-3 text-white/60 text-right">Score</th>
                  <th className="pb-3 text-white/60 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedGames.map((game, index) => {
                  const player = getPlayerById(game.player_id);
                  const rank = startIndex + index + 1;
                  
                  return (
                    <tr 
                      key={game.identifier}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4">
                        <div className={`
                          font-bold text-lg
                          ${rank === 1 ? 'text-yellow-400' : ''}
                          ${rank === 2 ? 'text-gray-300' : ''}
                          ${rank === 3 ? 'text-orange-400' : ''}
                          ${rank > 3 ? 'text-white/60' : ''}
                        `}>
                          #{rank}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="text-white/80 font-mono">
                          {game.id}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="text-white font-semibold">
                          {player?.name || 'Unknown'}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="text-2xl font-bold text-blue-400">
                          {game.score.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        {game.over ? (
                          <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full">
                            Over
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                            Active
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-white/10 p-4 flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={handlePrevPage}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="text-white/60 text-sm">
              Page {currentPage + 1} of {totalPages}
            </div>
            
            <Button
              variant="secondary"
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

