Create a TSX template for a mordern , system -adaptive (Light/Dark) chat using React and Tailwind CSS. The Layout should be a full screen , single-column chat window with large rounded corners.

Key features :

Use React functional componetns and manage state with a custome hook useChat (handling history , loading , error, message). use standard javascript .map() for list and conditional rendering (&&).

Theme Behaviours : Aoutomatically detect system preference
(preferes-color-scheme).

Light Mode : Clean off-white background (bg-gray-50) with dark text

Dark mode :Very dark background (dark:bg-gray-900) with light text.

implementation: use Tailwind's dark: prefix for all color-dependent classes

Header : Include a teal chat icon (bi-chat-dots-fill), a main tittle "Jupiter Ai Chat", and a subtitle "Your AI assistant". Backgtround should adapt (white in light mode / dark gray in dark mode ).

Chat History

display a list of messages from the history state in a scrollable area

user message: right-aligned with a teal background and whiter text (consistant in both modes)

bot message : left-aligned , use bg-gray-200 (Light mode) or dark:bg-gray-800 (dark mode)
show a pulsing "Bot is typing...." indicator on the left when loading is true , followed by a skeleton text loader

display a "Start the conversation' message when history is empty .

Ensure the design works on alll devices sizes.

input form :

a rounded text input field bound tot the message state . input background should adapt (white vs. dark mode ).

a Circular , teal send button witha paper plan icon

the form should be visually and functionally disabled when loading is true
