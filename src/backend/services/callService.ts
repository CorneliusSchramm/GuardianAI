import { openai, telnyx } from "@/config/clients";
import { TelnyxEventPayload } from "@/backend/models/types";
import {
  getUserByPhoneNumber,
  getCallByCallControlId,
  createCallWithUserAndThreadId,
  createTranscriptionChunk,
  getUnanalyzedChunksPerCall,
} from "@/backend/data/callRepository";

export async function handleAnsweredCall(callDetails: TelnyxEventPayload) {
  // todo: break out into separate extendable payload types
  // find User
  const recipientNumber = callDetails.to;
  const userId = await getUserByPhoneNumber(recipientNumber);
  if (!userId) {
    console.error(`User not found for phone number: ${recipientNumber}`);
    return;
  }
  console.log(`User found with id: ${userId}`);
  // Search and create call
  const callId = await getCallByCallControlId(callDetails.call_control_id);
  if (callId) {
    console.warn(`Call already exists with id: ${callId}`); // todo: also check if thread exists for this call (at thoment I assume if a call exists in db then a thread was created)
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

export async function handleTranscription(
  transcriptionDetails: TelnyxEventPayload
  // todo: break out into separate extendable payload types
) {
  const callControlId = transcriptionDetails.call_control_id;
  const transcriptionText = transcriptionDetails.transcription_data.transcript;
  await saveNewTranscriptionChunk(callControlId, transcriptionText);

  // analyze transcription
  const analyzedChunks = await getUnanalyzedChunksPerCall(callId);
  return;
}

async function saveNewTranscriptionChunk(
  callControlId: string,
  transcriptionText: string
) {
  // Service logic to save transcription chunk to database
  const callId = await getCallByCallControlId(callControlId);
  if (!callId) {
    console.error(`Call not found for call_control_id: ${callControlId}`);
    return;
  }
  // save transcription to db
  await createTranscriptionChunk(callId, transcriptionText);
}

export async function handleHangupCall() {
  // Service logic to handle call hangup
}
