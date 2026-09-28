export interface ChatMessage {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  modelName?: string; // Optional property for model name
}

export interface UseChatReturn {
  history: ChatMessage[];
  loading: boolean;
  error: string | null;
  message: string;
  setMessage: (msg: string) => void;
  sendMessage: (e?: React.FormEvent) => Promise<void>;
  clearHistory: () => void;
  setError: (error: string | null) => void;
}
