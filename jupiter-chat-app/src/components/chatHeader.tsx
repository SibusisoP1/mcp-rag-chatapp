import React from "react";

const chatHeader: React.FC<{
  history: unknown[];
  loading: boolean;
  clearHistory: () => void;
}> = ({ history, loading, clearHistory }) => {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700/60 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Teal Chat Icon */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/50 shadow-sm">
          <i
            className="bi bi-chat-dots-fill text-xl sm:text-2xl"
            aria-hidden="true"
          ></i>
          {/* Fallback inline SVG if icon font isn't loaded */}
          <svg
            className="w-6 h-6 hidden only-svg-fallback"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0" />
          </svg>
        </div>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
            Jupiter Ai Chat
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Your AI assistant
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Clear History Button when history is present */}
        {history.length > 0 && (
          <button
            type="button"
            onClick={clearHistory}
            disabled={loading}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Clear conversation"
          >
            Clear
          </button>
        )}

        {/* System Theme Status Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 text-xs font-medium border border-gray-200 dark:border-gray-600/50">
          <span className="w-2 h-2 rounded-full bg-teal-500"></span>
          <span>System Adaptive</span>
        </div>
      </div>
    </header>
  );
};

export default chatHeader;
