import { useEffect, useRef, useState } from "react";
import { LocationInput, type LocationData } from "./components/LocationInput";
import { useLocalStorage } from "./hooks/useLocalStorage"; // Import the custom hook
import {
  sendNotification,
  type NotificationPayload,
} from "./utils/sendNotification"; // Import the sendNotification function

const emojis = ["🍉", "🤗", "⛑️", "💆", "🗣️", "🤹"]; // Updated emojis array

export default function App() {
  const [name, setName] = useLocalStorage("name", ""); // Use local storage for name
  const [selectedEmoji, setSelected] = useState<string | null>(null);
  const [statusLog, setStatusLog] = useState<[string, boolean]>(["", false]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<LocationData>({ text: "" });
  const [message, setMessage] = useState("");

  const [editingName, setEditingName] = useState<boolean>(!name); // State to toggle name editing
  const nameInputRef = useRef<HTMLInputElement | null>(null); // Ref for the input field

  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [editingName]);

  const toggleSelected = (emoji: string) => {
    if (selectedEmoji === emoji) {
      setSelected(null); // Deselect if already selected
    } else {
      setSelected(emoji); // Select the new emoji
    }
    setStatusLog(["", false]); // Clear message when selection changes
  };

  const handleSend = async () => {
    setLoading(true); // Set loading to true
    try {
      const payload: NotificationPayload = {
        name: name.trim(),
        emoji: selectedEmoji || "", // Use the selected emoji directly
        message: message.trim(),
        location, // Includes text, coords, and accuracy
      };

      await sendNotification(payload); // Send the notification

      setStatusLog(["Help is on the way!", false]);
    } catch (error) {
      setStatusLog(["Error sending data: " + (error as Error).message, true]);
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <div className="min-h-screen p-6 text-center flex flex-col items-center justify-start space-y-6 bg-teal-100">
      {editingName ? (
        <input
          ref={nameInputRef}
          type="text"
          placeholder="Who are you?"
          className="border border-orange-300 p-4 rounded-xl w-full max-w-xs text-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          onBlur={() => name && setEditingName(false)} // Stop editing on blur
          onKeyDown={(e) => {
            if (name && e.key === "Enter") {
              setEditingName(false); // Stop editing on pressing Enter
            }
          }}
        />
      ) : (
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-semibold">Hello {name || "there"}!</h1>
          <button
            onClick={() => setEditingName(true)}
            className="text-sm text-gray-500 underline hover:text-gray-700"
          >
            Edit
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 w-full max-w-xs">
        {emojis.map((emoji) => (
          <button
            key={emoji} // Key by emoji string
            onClick={() => toggleSelected(emoji)}
            className={`text-6xl p-6 rounded-3xl shadow-md transition transform active:scale-95 ${
              selectedEmoji === emoji
                ? "bg-orange-300"
                : "bg-white border border-gray-300"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>

      <LocationInput location={location} setLocation={setLocation} />

      <div className="flex items-center justify-between w-full space-x-2 max-w-xs">
        <textarea
          placeholder="Message (optional)"
          className="flex-1 border border-orange-300 p-4 rounded-xl text-md focus:outline-none focus:ring-2 focus:ring-orange-400 w-full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={handleSend}
          disabled={loading || !name || !selectedEmoji} // Disable button if loading or data is incomplete
          className={`bg-teal-500 text-white text-3xl w-20 h-20 flex items-center justify-center rounded-full shadow-lg transition flex-shrink-0 ${
            loading || !name || !selectedEmoji
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-teal-600"
          }`}
        >
          {loading ? (
            <svg
              className="animate-spin h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : (
            "▶"
          )}
        </button>
      </div>

      <p
        className={`text-base max-w-xs px-2 text-left w-full ${
          statusLog[1] ? "text-red-500" : "text-gray-700"
        }`}
      >
        {statusLog[0]}
      </p>
    </div>
  );
}
