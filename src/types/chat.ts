export interface Message {
  id: string;
  type: 'system' | 'user';
  content: string;
  timestamp: Date;
}

export interface ChatState {
  isOpen: boolean;
  isMinimized: boolean;
  messages: Message[];
  isLoading: boolean;
}