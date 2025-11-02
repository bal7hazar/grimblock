import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PieceDebug } from "./PieceDebug";

interface PieceShapesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PieceShapesModal: React.FC<PieceShapesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-8"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 rounded-2xl shadow-2xl border border-white/10 max-w-7xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-3xl font-bold text-white">Piece Shapes Reference</h2>
          <Button
            variant="secondary"
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content with hidden scrollbar */}
        <div 
          className="flex-1 overflow-y-auto p-6 scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <PieceDebug />
        </div>
        
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
};

