import { motion } from 'framer-motion';
import { X, Maximize2, Minimize2 } from 'lucide-react';

interface ChatHeaderProps {
  isMinimized: boolean;
  isLoading: boolean;
  onMinimize: () => void;
  onClose: () => void;
}

export function ChatHeader({ isMinimized, isLoading, onMinimize, onClose }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b border-white/10 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          isLoading ? 'bg-[#ffd700] animate-pulse' : 'bg-[#44ff88]'
        }`} />
        <h3 className="text-white text-sm font-medium">AI Assistant</h3>
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          onClick={onMinimize}
          className="text-white/60 hover:text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
        </motion.button>
        <motion.button
          onClick={onClose}
          className="text-white/60 hover:text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={16} />
        </motion.button>
      </div>
    </div>
  );
}