import { TelnyxEvent } from "@/models/types";
import {
  handleAnsweredCall,
  handleHangupCall,
  handleTranscription,
} from "@/backend/services/guardianCallService";

export async function POST(request: Request) {
  // Log request headers for debugging
  // console.log("request:", request);

  // Parse the request body from JSON
  const requestBody: TelnyxEvent = await request.json();
  // console.log("requestBody", requestBody);

  const eventType = requestBody.data.event_type;

  switch (eventType) {
    case "call.answered":
      console.log(`Call answered.`);
      handleAnsweredCall(requestBody.data.payload);
      break;
    case "call.transcription":
      handleTranscription(requestBody.data.payload);
      break;
    case "call.hangup":
      handleHangupCall();
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
