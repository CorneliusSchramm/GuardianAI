import { TelnyxEvent } from "@/backend/models/types";

export async function POST(request: Request) {
  // Log request headers for debugging
  console.log(request.headers);

  // Parse the request body from JSON
  const requestBody: TelnyxEvent = (await request.json()).body;
  const eventType = requestBody.data.event_type;

  switch (eventType) {
    case "call.answered":
      return handleAnsweredCall(request, response);
    case "call.hangup":
      return handleHangupCall(response);
    case "call.transcription":
      return handleTranscription(request, response);
    default:
      return response.status(200).json({ message: "Event type not supported" });
  }
}
