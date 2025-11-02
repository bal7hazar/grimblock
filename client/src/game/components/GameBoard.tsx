import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid } from "./Grid";
import { PiecePreview } from "./PiecePreview";
import { ComboPopupsContainer } from "./ComboPopup";
import { CountdownOverlay } from "./CountdownOverlay";
import { Button } from "@/components/ui/button";
import type { GameState } from "../types";
import {
  createEmptyGrid,
  gameToGrid,
  canPlacePiece,
  placePiece,
  checkAndClearLines,
} from "../utils/gridUtils";
import { bitmapToBlocks } from "../utils/pieceUtils";
import { positionToGridIndex } from "../utils/indexUtils";
import { useEntities } from "@/contexts/entities";
import { usePlace, useSpawn, useCreate } from "@/hooks";
import { RefreshCw } from "lucide-react";
import { useAccount } from "@starknet-react/core";

// Global counter for piece IDs (shared across all game instances)
let globalPieceIdCounter = 0;

export const GameBoard: React.FC = () => {
  const { games, players } = useEntities();
  const { place: placeOnChain } = usePlace();
  const { spawn } = useSpawn();
  const { create } = useCreate();
  const { address } = useAccount();
  
  // Get current player
  const currentPlayer = useMemo(() => {
    if (!address || !players || players.length === 0) return null;
    const addressFelt = address.toString();
    return players.find(p => p.id === addressFelt);
  }, [address, players]);

  // Get the latest game for the current player (highest id)
  const latestGame = useMemo(() => {
    if (!games || games.length === 0 || !currentPlayer) return null;
    
    // Filter games for current player only
    const playerGames = games.filter(game => game.player_id === currentPlayer.id);
    
    if (playerGames.length === 0) return null;
    
    const latest = playerGames.reduce((latest, game) => 
      game.id > latest.id ? game : latest
    );
    console.log({ game: latest, playerGames: playerGames.length});
    return latest;
  }, [games, currentPlayer]);

  // Keep stable piece IDs across re-renders
  const pieceIdsRef = useRef<Map<string, string>>(new Map());
  const lastGameIdRef = useRef<number | null>(null);
  
  // Convert model pieces to GamePiece format with stable IDs
  const modelPieces = useMemo(() => {
    if (!latestGame || !latestGame.pieces) return [];
    
    // Clear cache if game ID changed (new game)
    if (lastGameIdRef.current !== latestGame.id) {
      pieceIdsRef.current.clear();
      lastGameIdRef.current = latestGame.id;
    }
    
    // Count occurrences of each subpack to handle duplicates
    const subpackCounts = new Map<number, number>();
    
    return latestGame.pieces.map(({ piece, orientation }) => {
      const subpack = orientation.into() * 16 + piece.into();
      
      // Track occurrence count for this subpack
      const occurrence = subpackCounts.get(subpack) || 0;
      subpackCounts.set(subpack, occurrence + 1);
      
      // Create cache key with occurrence count
      const cacheKey = `${latestGame.id}-${subpack}-${occurrence}`;
      
      // Get or create stable ID for this specific piece instance
      if (!pieceIdsRef.current.has(cacheKey)) {
        pieceIdsRef.current.set(
          cacheKey, 
          `piece-${globalPieceIdCounter++}-${Math.random().toString(36).substr(2, 9)}`
        );
      }
      
      const id = pieceIdsRef.current.get(cacheKey)!;
      const [height, width] = piece.size(orientation);
      const bitmap = piece.get(orientation);
      const blocks = bitmapToBlocks(bitmap, height, width);
      
      return {
        piece,
        orientation,
        blocks,
        subpack,
        id,
      };
    });
  }, [latestGame]);

  const [gameState, setGameState] = useState<GameState>({
    grid: createEmptyGrid(),
    score: 0,
    currentPieces: [],
    selectedPieceIndex: null,
    gameOver: false,
  });

  const [isPlacing, setIsPlacing] = useState(false);
  const [activeCombos, setActiveCombos] = useState<Array<{ id: string; combo: number }>>([]);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const countdownGameIdRef = useRef<number | null>(null);

  const handleComboComplete = useCallback((id: string) => {
    setActiveCombos(current => current.filter(c => c.id !== id));
  }, []);

  const handleCountdownComplete = useCallback(() => {
    setIsCountingDown(false);
  }, []);

  // Detect new game and trigger countdown (only for fresh games with score = 0)
  useEffect(() => {
    if (latestGame && latestGame.id !== countdownGameIdRef.current && latestGame.score === 0) {
      // New game detected with score 0 - truly fresh game
      console.log(`🎮 New game detected! ID: ${latestGame.id}, Score: ${latestGame.score}`);
      setIsCountingDown(true);
      countdownGameIdRef.current = latestGame.id;
    } else if (latestGame && latestGame.id !== countdownGameIdRef.current) {
      // Game exists but score > 0 (page reload on existing game)
      console.log(`📄 Existing game loaded (no countdown). ID: ${latestGame.id}, Score: ${latestGame.score}`);
      countdownGameIdRef.current = latestGame.id;
    }
  }, [latestGame]);

  // Update game state when blockchain data changes
  useEffect(() => {
    if (!latestGame) return;
    
    // Convert blockchain grid to visual grid using game.isIdle()
    const blockchainGrid = gameToGrid(latestGame);
    
    // Force update the grid when blockchain state changes
    // This will replace any optimistic updates with the real state
    setGameState(prev => {
      // Only update if there's an actual change to avoid infinite loops
      const gridChanged = JSON.stringify(prev.grid) !== JSON.stringify(blockchainGrid);
      const piecesChanged = modelPieces.length !== prev.currentPieces.length;
      
      if (!gridChanged && !piecesChanged && prev.score === latestGame.score) {
        return prev;
      }
      
      return {
        ...prev,
        grid: blockchainGrid,
        currentPieces: modelPieces,
        score: latestGame.score,
        gameOver: latestGame.over,
      };
    });
  }, [latestGame, modelPieces]);

  const handleDragStart = useCallback((index: number) => {
    // Block drag during countdown
    if (isCountingDown) return;
    
    setGameState(prev => ({
      ...prev,
      selectedPieceIndex: index,
    }));
  }, [isCountingDown]);

  const handleDragEnd = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      selectedPieceIndex: null,
    }));
  }, []);

  const handleDrop = useCallback(
    async (row: number, col: number) => {
      // Block interaction during countdown or placing
      if (gameState.selectedPieceIndex === null || gameState.gameOver || !latestGame || isPlacing || isCountingDown) return;

      const selectedPiece = gameState.currentPieces[gameState.selectedPieceIndex];
      
      if (!canPlacePiece(gameState.grid, selectedPiece, row, col)) {
        return;
      }

      // Calculate grid index - it should be the bit position of the bottom-right block
      const gridIndex = positionToGridIndex(row, col, selectedPiece);

      console.log(`Placing piece ${gameState.selectedPieceIndex} at top-left (${row}, ${col}) = grid_index ${gridIndex}`);

      setIsPlacing(true);

      try {
        // Call the blockchain place function
        const success = await placeOnChain(
          latestGame.id,
          gameState.selectedPieceIndex,
          gridIndex
        );

        if (!success) {
          console.error("Failed to place piece on blockchain");
          setIsPlacing(false);
          return;
        }

        console.log("Piece placed successfully on blockchain!");
      } catch (error) {
        console.error("Error placing piece:", error);
        setIsPlacing(false);
        return;
      } finally {
        setIsPlacing(false);
      }

      // Optimistic UI update - show piece in its color first
      let optimisticGrid = placePiece(
        gameState.grid,
        selectedPiece,
        row,
        col,
        selectedPiece.piece.color()
      );

      // Immediately show the piece in color
      setGameState(prev => ({
        ...prev,
        grid: optimisticGrid,
        selectedPieceIndex: null,
      }));

      // After 200ms, clear lines and transition to gray
      setTimeout(() => {
        setGameState(prev => {
          // Clear complete lines/columns
          const { newGrid: clearedGrid, linesCleared } = checkAndClearLines(prev.grid);
          
          // Show combo popup if lines were cleared
          if (linesCleared > 0) {
            const comboValue = (latestGame?.combo || 0) + 1; // Will be incremented on blockchain
            const comboId = `combo-${Date.now()}-${Math.random()}`;
            console.log(`⭐ Triggering combo popup: ${comboValue}x combo, +${comboValue * 10} points`);
            setActiveCombos(current => [...current, { id: comboId, combo: comboValue }]);
          }
          
          // Convert all blocks to gray to match blockchain state
          const grayGrid = clearedGrid.map(row => 
            row.map(cell => 
              cell.filled ? { filled: true, color: '#64748b' } : cell
            )
          );
          
          console.log(`Cleared ${linesCleared} lines optimistically, current combo: ${latestGame?.combo || 0}`);
          
          return {
            ...prev,
            grid: grayGrid,
          };
        });
      }, 200); // Brief delay before clearing lines
    },
    [gameState, latestGame, placeOnChain, isPlacing, isCountingDown]
  );

  const handleReset = useCallback(() => {
    // Reset to blockchain state
    if (latestGame) {
      const blockchainGrid = gameToGrid(latestGame);
      setGameState({
        grid: blockchainGrid,
        score: latestGame.score,
        currentPieces: modelPieces,
        selectedPieceIndex: null,
        gameOver: latestGame.over,
      });
    } else {
      setGameState({
        grid: createEmptyGrid(),
        score: 0,
        currentPieces: [],
        selectedPieceIndex: null,
        gameOver: false,
      });
    }
  }, [latestGame, modelPieces]);

  // Show message if no game exists
  if (!latestGame || !latestGame.hasStarted()) {
    return (
      <div className="flex flex-col items-center gap-6">
        {/* Action Buttons */}
        <div className="flex gap-4 items-center">
          {!currentPlayer && (
            <Button onClick={() => spawn()} variant="default" size="lg">
              Spawn Player
            </Button>
          )}
          {currentPlayer && (
            <Button onClick={() => create()} variant="default" size="lg">
              New Game
            </Button>
          )}
        </div>

        {/* Message */}
        <div className="bg-blue-500/20 border-2 border-blue-500 rounded-xl p-8 text-center max-w-md">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-wider">No Active Game</h2>
          <p className="text-white/80 text-lg mb-4 tracking-wider">
            {!currentPlayer 
              ? "Welcome to Grim Block!"
              : "Ready to play?"
            }
          </p>
          <p className="text-white/60 text-lg tracking-wider">
            {!currentPlayer
              ? "Click the 'Spawn Player' button above to create your player profile and start playing."
              : "Click the 'New Game' button above to start a fresh game with 3 random pieces."
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Action Buttons */}
      <div className="flex gap-4 items-center">
        {!currentPlayer && (
          <Button onClick={() => spawn()} variant="default" size="lg">
            Spawn Player
          </Button>
        )}
        {currentPlayer && (
          <Button onClick={() => create()} variant="default" size="lg">
            New Game
          </Button>
        )}
        <Button 
          onClick={handleReset} 
          variant="default" 
          size="icon"
          disabled={isPlacing}
          title="Sync with Blockchain"
          className="h-10 w-10"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>

      {/* Score */}
      <div className="text-6xl font-bold text-white text-center">
        {gameState.score}
      </div>

      {/* Grid with overlays */}
      <div className="relative inline-block">
        {/* Combo Popups */}
        <ComboPopupsContainer combos={activeCombos} onRemove={handleComboComplete} />

        {/* Countdown Overlay */}
        <CountdownOverlay isActive={isCountingDown} onComplete={handleCountdownComplete} />

        {/* Loading overlay */}
        {isPlacing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
            <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border-2 border-blue-500">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="text-white font-semibold text-lg">Placing on blockchain...</span>
              </div>
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState.gameOver && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-40 rounded-xl">
            <div className="bg-slate-800/90 border-2 border-red-500 rounded-2xl p-8 text-center shadow-2xl">
              <h2 className="text-4xl font-bold text-white mb-3">Game Over!</h2>
              <p className="text-white/90 text-2xl mb-4">Final Score: {gameState.score}</p>
              <p className="text-white/60 text-sm mb-6">Create a new game to continue playing</p>
              <Button onClick={() => create()} variant="default" size="lg">
                New Game
              </Button>
            </div>
          </div>
        )}

        <Grid
          grid={gameState.grid}
          selectedPiece={
            gameState.selectedPieceIndex !== null
              ? gameState.currentPieces[gameState.selectedPieceIndex]
              : null
          }
          onDrop={handleDrop}
        />
      </div>

      {/* Pieces with animation */}
      <div className="flex justify-around gap-8 items-center w-full min-h-[120px]">
        {gameState.currentPieces.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {gameState.currentPieces.map((piece, index) => (
              <motion.div
                key={piece.id}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  layout: { type: "spring", stiffness: 300, damping: 30 },
                  scale: { duration: 0.2 },
                  opacity: { duration: 0.2 }
                }}
                className={isCountingDown ? "opacity-50 pointer-events-none" : ""}
              >
                <PiecePreview
                  piece={piece}
                  index={index}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-white/60 text-center">
            <div className="animate-pulse">Waiting for blockchain pieces...</div>
          </div>
        )}
      </div>
    </div>
  );
};

