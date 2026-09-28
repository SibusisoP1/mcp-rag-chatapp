const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function sendMessagetoLLM(
  message: string,
): Promise<{ reply: string }> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage =
      errorData?.error || `Failed to send message. Status: ${response.status}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return {
    reply:
      data.reply ||
      data.choices?.[0]?.message?.content ||
      "No response received.",
  };
}
