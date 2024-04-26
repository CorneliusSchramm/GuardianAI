import { openai } from "@/config/clients";
import { TelnyxEventPayload } from "@/backend/models/types";
import { getUserByPhoneNumber } from "../data/callRepository";

export async function handleAnsweredCall(callDetails: TelnyxEventPayload) {
  // find User
  const recipientNumber = callDetails.to;
  const userId = await getUserByPhoneNumber(recipientNumber);
  if (!userId) {
    console.error(`User not found for phone number: ${recipientNumber}`);
    return;
  }

  // Search and create call


export async function handleHangupCall() {
  // Service logic to handle call hangup
}

export async function handleTranscription() {
  // Service logic for transcription
}
