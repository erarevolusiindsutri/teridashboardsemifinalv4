import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';

interface DataControlsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function DataControls({ onEdit, onDelete, className = '' }: DataControlsProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {onEdit && (
        <motion.button
          onClick={onEdit}
          className="p-1 text-white/40 hover:text-white/80"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Edit2 size={12} />
        </motion.button>
      )}
      {onDelete && (
        <motion.button
          onClick={onDelete}
          className="p-1 text-white/40 hover:text-[#ff4444]"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 size={12} />
        </motion.button>
      )}
    </div>
  );
}