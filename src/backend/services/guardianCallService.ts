import { TelnyxEventPayload, AnalysisOutput } from "@/backend/models/types";
import {
  getUserByPhoneNumber,
  getCallByCallControlId,
  createCallWithUserAndThreadId,
  createTranscriptionChunk,
  getUnanalyzedChunksPerCall,
  updateTranscriptionChunksAsAnalyzed,
  saveAnanlysisChunk,
} from "@/backend/data/callRepository";
import { Console } from "console";
import fs from "fs";
import { getCurrentTime } from "@/utils/datetime";
import {
  playWarningSound,
  startTranscription,
} from "@/backend/services/telnyxService";
import {
  createThread,
  analyzeTranscription,
} from "@/backend/services/openAIService";

// Constants
const ANALYSIS_CHUNK_MIN_LENGTH: number = 200;

// Logging
const output = fs.createWriteStream("./out.log");
const errorOutput = fs.createWriteStream("./err.log");
const options = {
  stdout: output,
  stderr: errorOutput,
  ignoreErrors: true,
  colorMode: true,
};
const logger = new Console(options);

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
  const call = await getCallByCallControlId(callDetails.call_control_id);
  if (call) {
    console.warn(`Call already exists with id: ${call.call_id}`); // todo: also check if thread exists for this call (at thoment I assume if a call exists in db then a thread was created)
    return;
  }
  const newThread = await createThread();
  await createCallWithUserAndThreadId(
    callDetails.call_control_id,
    newThread.id,
    userId,
    callDetails.start_time
  );

  // start transcription
  await startTranscription(callDetails.call_control_id);
}

export async function handleTranscription(
  transcriptionDetails: TelnyxEventPayload
  // todo: break out into separate extendable payload types
) {
  const callControlId = transcriptionDetails.call_control_id;
  const transcriptionText = transcriptionDetails.transcription_data.transcript;

  const call = await getCallByCallControlId(callControlId);
  if (!call) {
    console.error(`Call not found for call_control_id: ${callControlId}`);
    return;
  }

  // save transcription to db
  await createTranscriptionChunk(call.call_id, transcriptionText);

  // analyze transcription
  const unanalyzedChunks = await getUnanalyzedChunksPerCall(call.call_id);
  let unanalyzedText: string = unanalyzedChunks
    .map((d) => d.transcription_chunk)
    .join(" ");

  if (unanalyzedText.length > ANALYSIS_CHUNK_MIN_LENGTH) {
    const analysisResult = await analyzeTranscription(
      unanalyzedText,
      call.thread_id
    );
    const savedAnalysisChunk = await saveAnanlysisChunk(analysisResult);
    logger.log(analysisResult);
    const transcriptionChunkIds = unanalyzedChunks.map(
      (d) => d.transcription_chunk_id
    );
    await updateTranscriptionChunksAsAnalyzed(
      transcriptionChunkIds,
      savedAnalysisChunk.analyses_chunk_id
    );

    // todo: save analysisResult to supabase and mark transcription chunks as analyzed
    if (analysisResult.score >= 80) {
      console.log("Scam detected!");
      logger.log(
        "\x1b[31m%s\x1b[0m",
        `[${getCurrentTime()}] Scam detected!!! Warning the user...`
      );
      await playWarningSound(callControlId); // await necessary here?
    }
  }

  return;
}

export async function handleHangupCall() {
  // Service logic to handle call hangup
  logger.log(`[${getCurrentTime()}] Call ended. Stopping transcription...`);
}
