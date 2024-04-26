import { openai, telnyx } from "@/config/clients";
import { TelnyxEventPayload } from "@/backend/models/types";
import {
  getUserByPhoneNumber,
  getCallByCallControlId,
  createCallWithUserAndThreadId,
} from "@/backend/data/callRepository";

export async function handleAnsweredCall(callDetails: TelnyxEventPayload) {
  // find User
  const recipientNumber = callDetails.to;
  const userId = await getUserByPhoneNumber(recipientNumber);
  if (!userId) {
    console.error(`User not found for phone number: ${recipientNumber}`);
    return;
  }
  console.log(`User found with id: ${userId}`);
  // Search and create call
  const call_id = await getCallByCallControlId(callDetails.call_control_id);
  if (call_id) {
    console.warn(`Call already exists with id: ${call_id}`); // todo: also check if thread exists for this call (at thoment I assume if a call exists in db then a thread was created)
    return;
  }
  const newThread = await openai.beta.threads.create();
  const createdCallId = await createCallWithUserAndThreadId(
    callDetails.call_control_id,
    newThread.id,
    userId,
    callDetails.start_time
  );

  // start transcription
  const call = new telnyx.Call({
    call_control_id: callDetails.call_control_id,
  });
  try {
    await call.transcription_start({ language: "en" });
  } catch (error) {
    console.error(error);
  }
}

export async function handleTranscription() {
  // Service logic for transcription
}

export async function handleHangupCall() {
  // Service logic to handle call hangup
}
