import React, { useEffect, useRef } from "react";
import type { ChatMessage } from "../types/chat";
import "../styles/scrollbar.css";

interface ChatMessageProps {
  history: ChatMessage[];
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

const ChatMessages: React.FC<ChatMessageProps> = ({
  history,
  loading,
  error,
  setError,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message when history or loading state updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);
  return (
    <main className="chatContainer flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
      {/* Empty State: Display "Start the conversation" when history is empty */}
      {history.length === 0 && !loading && (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 sm:p-10 my-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 border border-teal-100 dark:border-teal-900/30 shadow-inner">
            <i
              className="bi bi-chat-dots-fill text-3xl sm:text-4xl"
              aria-hidden="true"
            ></i>
          </div>
          <h2 className=" text-gray-500  mb-2">
            Start the conversation by typing a message below.
          </h2>
        </div>
      )}

      {/* Standard JavaScript .map() for message list */}
      {history.map((msg) => {
        const isUser = msg.sender === "user";

        return (
          <div
            key={msg.id}
            className={`flex flex-col ${isUser ? "self-end items-end" : "self-start items-start space-x-3"}`}
          >
            <div
              className={`flex items-center mb-1.5 space-x-2 ${isUser ? "flex-row-reverse" : ""}`}
            >
              {/* Bot Avatar */}
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center flex-shrink-0 mt-0.5 border border-teal-200 dark:border-teal-800">
                  <i className="bi bi-robot text-sm sm:text-base"></i>
                </div>
              )}

              <p
                className={`text-xs ${isUser ? "text-teal-600" : "text-gray-500 dark:text-gray-400"}`}
              >
                {isUser ? "You" : msg.modelName || "Jupiter bot"}
              </p>
            </div>

            {/* Message Bubble */}
            <div
              className={`relative max-w-[85%] sm:max-w-[75%] px-4 py-3 shadow-sm transition-colors duration-200 ${
                isUser
                  ? "bg-teal-600 text-white rounded-2xl rounded-tr-sm"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl rounded-tl-sm"
              }`}
            >
              <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                {msg.text}
              </p>
              <span
                className={`block text-[10px] mt-1.5 text-right font-medium ${
                  isUser
                    ? "text-teal-100/90"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        );
      })}

      {/* Pulsing "Bot is typing...." indicator and Skeleton text loader when loading is true */}
      {loading && (
        <div className="flex flex-col items-start space-y-2.5">
          {/* Pulsing indicator */}
          <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 font-medium text-xs sm:text-sm animate-pulse ml-11">
            <span className="w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400 animate-ping"></span>
            <span>Bot is typing....</span>
          </div>

          {/* Bot avatar + Skeleton Loader */}
          <div className="flex items-start space-x-3 w-full">
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center flex-shrink-0 animate-pulse border border-teal-200 dark:border-teal-800">
              <i className="bi bi-robot text-sm"></i>
            </div>

            {/* Skeleton text loader */}
            <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl rounded-tl-sm p-4 w-64 max-w-[80%] space-y-2.5 shadow-sm animate-pulse">
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded-full w-4/5"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded-full w-full"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded-full w-2/3"></div>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert Display */}
      {error && (
        <div className="p-3 sm:p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="bi bi-exclamation-triangle-fill text-red-500"></i>
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-600 dark:text-red-400 hover:underline font-medium text-xs ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      <div ref={messagesEndRef} />
    </main>
  );
};

export default ChatMessages;
