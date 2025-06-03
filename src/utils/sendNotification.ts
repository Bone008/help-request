import type { LocationData } from "../components/LocationInput";

const NTFY_TOPIC = "hannatesting";

interface NotificationPayload {
  name: string;
  message: string;
  location: LocationData;
}

export async function sendNotification(payload: NotificationPayload) {
  const { name, message, location } = payload;

  // Construct the message body
  const formattedAccuracy = location.accuracy
    ? `(accuracy: ±${location.accuracy.toFixed(0)} m)`
    : undefined;
  const messageParts = [message, location.text, formattedAccuracy];
  const messageBody = messageParts.filter(Boolean).join(" ");

  // Construct the click URL for Google Maps if coordinates are present
  const clickUrl = location.coords
    ? `https://www.google.com/maps?q=${location.coords.lat},${location.coords.lng}`
    : undefined;

  try {
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: "POST",
      headers: {
        "X-Priority": "urgent", // Set priority to urgent
        "X-Title": `${name} needs help`, // Notification title
        "X-Click": clickUrl ?? "",
      },
      body: messageBody, // Notification body
    });
  } catch (error) {
    console.error("Failed to send notification:", error);
    throw error;
  }
}
