import { TelnyxEvent } from "@/backend/models/types";
import {
  handleAnsweredCall,
  handleHangupCall,
  handleTranscription,
} from "@/backend/services/callService";

export async function POST(request: Request) {
  // Log request headers for debugging
  console.log(request.headers);

  // Parse the request body from JSON
  const requestBody: TelnyxEvent = (await request.json()).body;
  const eventType = requestBody.data.event_type;

  switch (eventType) {
    case "call.answered":
      handleAnsweredCall();
      break;
    case "call.hangup":
      handleHangupCall();
      break;
    case "call.transcription":
      handleTranscription();
      break;
    default:
      console.log(`Unhandled event type: ${eventType}`);
      break;
  }
  return new Response(null, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
