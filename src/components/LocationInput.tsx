import { useState } from "react";
import { FiCrosshair, FiX } from "react-icons/fi"; // Import icons from react-icons

export interface LocationData {
  text: string;
  coords?: { lat: number; lng: number };
  accuracy?: number;
}

interface LocationInputProps {
  location: LocationData;
  setLocation: (location: LocationData) => void;
}

export function LocationInput({ location, setLocation }: LocationInputProps) {
  const [loadingCoords, setLoadingCoords] = useState(false);

  const requestCoordinates = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoadingCoords(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          ...location,
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          accuracy: position.coords.accuracy, // Include accuracy
        });
        setLoadingCoords(false);
      },
      (error) => {
        alert("Could not access your location :(\n\n" + error.message);
        setLoadingCoords(false);
      }
    );
  };

  const clearLocation = () => {
    setLocation({ text: "" });
  };

  return (
    <div className="w-full max-w-xs flex flex-col space-y-2">
      <div className="flex items-center space-x-2 w-full">
        <input
          type="text"
          placeholder="Where are you? (optional)"
          className="flex-1 border border-orange-300 p-4 rounded-xl text-md focus:outline-none focus:ring-2 focus:ring-orange-400 w-full"
          value={location.text}
          onChange={(e) => setLocation({ ...location, text: e.target.value })}
        />
        {location.coords ? (
          <div className="flex flex-col items-center space-y-1">
            <button
              onClick={clearLocation}
              className="p-3 rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600"
              title="Clear Location"
            >
              <FiX className="h-5 w-5" />
            </button>
            <p className="text-sm text-gray-600">
              +-{location.accuracy?.toFixed(0)} m
            </p>
          </div>
        ) : (
          <button
            onClick={requestCoordinates}
            disabled={loadingCoords}
            className={`p-3 rounded-full bg-blue-500 text-white shadow-md transition inline-flex items-center ${
              loadingCoords
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
            title="Use GPS"
          >
            {loadingCoords ? (
              <svg
                className="animate-spin h-5 w-5"
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
              <>
                <FiCrosshair className="h-5 w-5" />
                &nbsp;GPS
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
