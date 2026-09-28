import { useEffect } from "react";
import { useChat } from "../hooks/useChat";
import "../App.css";
import ChatHeader from "./chatHeader";
import ChatMessages from "./chatMessage";
import ChatInput from "./chatInput";

export function Chat() {
  const {
    history,
    loading,
    error,
    message,
    setMessage,
    sendMessage,
    clearHistory,
    setError,
  } = useChat();

  // Automatically detect and sync with system preference (prefers-color-scheme)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    // Set initial theme based on system preference
    applyTheme(mediaQuery.matches);

    // Listen for OS/browser color scheme changes in real-time
    const themeListener = (event: MediaQueryListEvent) => {
      applyTheme(event.matches);
    };

    mediaQuery.addEventListener("change", themeListener);
    return () => {
      mediaQuery.removeEventListener("change", themeListener);
    };
  }, []);

  return (
    <div className="min-h-screen h-screen w-full flex items-center justify-center p-2 sm:p-4 md:p-6 bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      {/* Full-screen single-column chat window with large rounded corners */}
      <div className="w-full max-w-4xl h-full sm:h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {/* Header */}
        <ChatHeader
          history={history}
          loading={loading}
          clearHistory={clearHistory}
        />
        {/* Chat History Scrollable Area */}
        <ChatMessages
          history={history}
          loading={loading}
          error={error}
          setError={setError}
        />

        {/* Input Form */}
        <ChatInput
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default Chat;
