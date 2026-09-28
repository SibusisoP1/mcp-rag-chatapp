import React from "react";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  sendMessage: (e?: React.FormEvent) => void;
  loading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  sendMessage,
  loading,
}) => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700/60 p-3 sm:p-4 transition-colors duration-300">
      <form
        onSubmit={sendMessage}
        className="flex items-center space-x-2 sm:space-x-3"
      >
        {/* Rounded Text Input Field */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            loading ? "Please wait for response..." : "Type your message..."
          }
          disabled={loading}
          className="flex-1 rounded-full px-5 py-3 sm:py-3.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {/* Circular Teal Send Button with Paper Plane Icon */}
        <button
          type="submit"
          disabled={loading || !message.trim()}
          aria-label="Send message"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-teal-600 hover:bg-teal-700 active:scale-95 text-white flex items-center justify-center shadow-md transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-teal-600 disabled:active:scale-100"
        >
          <i
            className="bi bi-send-fill text-base sm:text-lg translate-x-[-1px] translate-y-[-1px]"
            aria-hidden="true"
          ></i>
          {/* Fallback inline SVG for paper plane */}
          <svg
            className="w-5 h-5 hidden only-svg-fallback"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="m15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
          </svg>
        </button>
      </form>
    </footer>
  );
};

export default ChatInput;
