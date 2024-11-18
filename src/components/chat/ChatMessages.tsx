import { useRef, useEffect } from 'react';
import { Message } from '../../types/chat';
import { ChatMessage } from './ChatMessage';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-[300px] overflow-y-auto p-4 space-y-4 custom-scrollbar">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          type={message.type}
          content={message.content}
          timestamp={message.timestamp}
        />
      ))}
      {isLoading && (
        <div className="flex items-center gap-2 text-white/60">
          <div className="w-2 h-2 rounded-full bg-[#ffd700] animate-pulse" />
          <span className="text-sm">Analyzing data...</span>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}