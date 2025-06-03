import axios from "axios";
import { useState } from "react";

const emojis = [
  { id: "fruit", label: "🍊" },
  { id: "person", label: "🧑" },
  { id: "leaf", label: "🍂" },
  { id: "plus", label: "➕" },
];

export default function App() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!name || !selected) {
      setMessage("Please enter your name and select an emoji.");
      return;
    }

    try {
      const payload = {
        name,
        selection: selected,
        location,
      };

      await axios.post("https://your-backend-url.com/api/submit", payload);
      setMessage("Data sent successfully!");
    } catch (error) {
      setMessage("Error sending data.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-orange-100 to-white text-center flex flex-col items-center justify-start space-y-6">
      <h1 className="text-5xl font-extrabold text-orange-500 mt-4">Tänk</h1>

      <input
        type="text"
        placeholder="Enter your name"
        className="border border-orange-300 p-4 rounded-xl w-full max-w-xs text-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-6 w-full max-w-xs">
        {emojis.map((emoji) => (
          <button
            key={emoji.id}
            onClick={() => setSelected(emoji.id)}
            className={`text-6xl p-6 rounded-3xl shadow-md transition transform active:scale-95 ${
              selected === emoji.id ? "bg-orange-300" : "bg-white border border-gray-300"
            }`}
          >
            {emoji.label}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Gata / Tänt (location optional)"
        className="border border-orange-300 p-4 rounded-xl w-full max-w-xs text-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <button
        onClick={handleSend}
        className="bg-red-500 text-white text-3xl w-20 h-20 flex items-center justify-center rounded-full shadow-lg hover:bg-red-600 transition"
      >
        ▶
      </button>

      {message && <p className="text-gray-700 text-base mt-2 max-w-xs px-2">{message}</p>}
    </div>
  );
}
