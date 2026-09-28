import { useState, useCallback } from "react";
import type { ChatMessage } from "../types/chat";
import type { UseChatReturn } from "../types/chat";
import { sendMessagetoLLM } from "../api/chat.api";

export function useChat(): UseChatReturn {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const sendMessage = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      const trimmedMessage = message.trim();
      if (!trimmedMessage || loading) {
        return;
      }

      // Add user message to history
      const userMessage: ChatMessage = {
        id: Date.now(),
        sender: "user",
        text: trimmedMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setHistory((prev) => [...prev, userMessage]);
      setMessage("");
      setLoading(true);
      setError(null);

      try {
        // Simulate AI assistant thinking and network response
        // await new Promise((resolve) => setTimeout(resolve, 1800));
        const response = await sendMessagetoLLM(trimmedMessage);

        // Example trigger for testing error handling: typing "/error"
        if (trimmedMessage.toLowerCase() === "/error") {
          throw new Error(
            "Failed to reach Jupiter AI service. Please try again.",
          );
        }

        // Pick a dynamic response based on query or general response
        const botResponseText = response.reply;

        const botMessage: ChatMessage = {
          id: Date.now() + 1,
          sender: "bot",
          text: botResponseText,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setHistory((prev) => [...prev, botMessage]);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while communicating with Jupiter AI.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [message, loading],
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    setError(null);
  }, []);

  return {
    history,
    loading,
    error,
    message,
    setMessage,
    sendMessage,
    clearHistory,
    setError,
  };
}

export default useChat;
