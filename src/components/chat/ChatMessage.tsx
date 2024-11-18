import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  type: 'system' | 'user';
  content: string;
  timestamp: Date;
}

export function ChatMessage({ type, content, timestamp }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className="flex gap-2">
        {type === 'system' && (
          <div className="w-6 h-6 rounded-full bg-[#4488ff]/20 flex items-center justify-center flex-shrink-0">
            <Bot size={14} className="text-[#4488ff]" />
          </div>
        )}
        <div
          className={`max-w-[240px] rounded-lg p-3 ${
            type === 'user'
              ? 'bg-[#4488ff] text-white ml-6'
              : 'bg-white/10 text-white'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{content}</p>
          <p className="text-[10px] opacity-60 mt-1">
            {timestamp.toLocaleTimeString()}
          </p>
        </div>
        {type === 'user' && (
          <div className="w-6 h-6 rounded-full bg-[#44ff88]/20 flex items-center justify-center flex-shrink-0">
            <User size={14} className="text-[#44ff88]" />
          </div>
        )}
      </div>
    </motion.div>
  );
}