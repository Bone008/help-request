import axios from "axios";
import { useState } from "react";
import { LocationInput, type LocationData } from "./components/LocationInput"; // Import the Location interface

const emojis = [
  { id: "fruit", label: "🍊" },
  { id: "person", label: "🧑" },
  { id: "leaf", label: "🍂" },
  { id: "plus", label: "➕" },
];

export default function App() {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [statusLog, setStatusLog] = useState<[string, boolean]>(["", false]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<LocationData>({ text: "" });

  const toggleSelected = (id: string) => {
    if (selected === id) {
      setSelected(null); // Deselect if already selected
    } else {
      setSelected(id); // Select the new emoji
    }
    setStatusLog(["", false]); // Clear message when selection changes
  };

  const handleSend = async () => {
    if (!name || !selected) {
      setStatusLog(["Please enter your name and select an emoji.", true]);
      return;
    }

    setLoading(true); // Set loading to true
    try {
      const payload = {
        name,
        selection: selected,
        location, // Includes text, coords, and accuracy
      };

      //await axios.post("/api/notify", payload);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
      console.log("Simulated payload:", payload); // Log the payload to the console

      setStatusLog(["Data sent successfully!", false]);
    } catch (error) {
      setStatusLog(["Error sending data: " + (error as Error).message, true]);
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <div className="min-h-screen p-6 text-center flex flex-col items-center justify-start space-y-6 bg-teal-100">
      <input
        type="text"
        placeholder="Who are you?"
        className="border border-orange-300 p-4 rounded-xl w-full max-w-xs text-md focus:outline-none focus:ring-2 focus:ring-orange-400"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-6 w-full max-w-xs">
        {emojis.map((emoji) => (
          <button
            key={emoji.id}
            onClick={() => toggleSelected(emoji.id)}
            className={`text-6xl p-6 rounded-3xl shadow-md transition transform active:scale-95 ${
              selected === emoji.id
                ? "bg-orange-300"
                : "bg-white border border-gray-300"
            }`}
          >
            {emoji.label}
          </button>
        ))}
      </div>

      <LocationInput location={location} setLocation={setLocation} />

      <div className="flex items-center justify-between w-full max-w-xs">
        <p
          className={`text-base max-w-xs px-2 text-left ${
            statusLog[1] ? "text-red-500" : "text-gray-700"
          }`}
        >
          {statusLog[0]}
        </p>

        <button
          onClick={handleSend}
          disabled={loading} // Disable button when loading
          className={`bg-teal-500 text-white text-3xl w-20 h-20 flex items-center justify-center rounded-full shadow-lg transition flex-shrink-0 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
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
    </div>
  );
}
