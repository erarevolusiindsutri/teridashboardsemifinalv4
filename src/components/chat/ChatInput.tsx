import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="p-4 border-t border-white/10">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
          disabled={disabled}
          className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4488ff] disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <motion.button
          onClick={handleSend}
          className="w-8 h-8 rounded-lg bg-[#4488ff] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!input.trim() || disabled}
        >
          <Send size={14} />
        </motion.button>
      </div>
    </div>
  );
}