import { useEffect, useRef, useState } from "react";
import { LocationInput, type LocationData } from "./components/LocationInput";
import { useLocalStorage } from "./hooks/useLocalStorage"; // Import the custom hook
import {
  sendNotification,
  type NotificationPayload,
} from "./utils/sendNotification"; // Import the sendNotification function
import { useConfig } from "./hooks/useConfig";

export default function App() {
  const { config, loading: configLoading } = useConfig();
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

      await sendNotification(config!.nftyTopic, payload); // Send the notification

      setStatusLog(["Help is on the way!", false]);
    } catch (error) {
      setStatusLog(["Error sending data: " + (error as Error).message, true]);
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  // Disable button if loading or data is incomplete
  const canSubmit =
    loading || configLoading || !name || (!selectedEmoji && !message.trim());

  return (
    <div className="min-h-screen p-2 sm:p-6 flex flex-col items-center justify-start bg-teal-100">
      <div className="w-full max-w-lg flex flex-col items-center space-y-4 sm:space-y-6">
        {editingName ? (
          <input
            ref={nameInputRef}
            type="text"
            placeholder="Who are you?"
            className="border border-orange-300 p-4 rounded-lg w-full text-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            onBlur={() => name && setEditingName(false)} // Stop editing on blur
            onKeyDown={(e) => {
              if (name && e.key === "Enter") setEditingName(false); // Stop editing on pressing Enter
            }}
          />
        ) : (
          <div className="flex items-center space-x-2 w-full">
            <h1 className="text-2xl font-semibold">Hello {name || "there"}!</h1>
            <button
              onClick={() => setEditingName(true)}
              className="text-sm text-gray-500 underline hover:text-gray-700"
            >
              Edit
            </button>
          </div>
        )}

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 w-full">
          {config?.emojis.map((emoji) => (
            <button
              key={emoji} // Key by emoji string
              onClick={() => toggleSelected(emoji)}
              className={`text-4xl p-2 sm:p-3 rounded-md border shadow-sm transition transform active:scale-95
                ${
                  selectedEmoji === emoji
                    ? "bg-orange-200 border-orange-400"
                    : "bg-white border-gray-300 hover:bg-orange-100"
                }
              `}
              style={{ minWidth: "0" }}
            >
              {emoji}
            </button>
          ))}
        </div>

        <LocationInput location={location} setLocation={setLocation} />

        <div className="grid grid-cols-5 items-center justify-between w-full space-x-2">
          <textarea
            placeholder="Message (optional)"
            className="col-span-4 border border-orange-300 p-4 rounded-lg text-md focus:outline-none focus:ring-2 focus:ring-orange-400 w-full resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
          />

          <div className="flex justify-center">
            <button
              onClick={handleSend}
              disabled={canSubmit}
              className={`bg-teal-500 text-white text-3xl w-16 h-16 flex items-center justify-center rounded-full shadow-lg transition flex-shrink-0
              ${
                canSubmit
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-teal-600"
              }
              `}
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-8 w-8"
                >
                  <path
                    d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <p
          className={`text-base max-w-lg px-2 text-left w-full ${
            statusLog[1] ? "text-red-500" : "text-gray-700"
          }`}
        >
          {statusLog[0]}
        </p>
      </div>
    </div>
  );
}
