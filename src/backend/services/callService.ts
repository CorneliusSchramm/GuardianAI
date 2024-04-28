import { openai, telnyx } from "@/config/clients";
import { TelnyxEventPayload, AnalysisOutput } from "@/backend/models/types";
import {
  getUserByPhoneNumber,
  getCallByCallControlId,
  createCallWithUserAndThreadId,
  createTranscriptionChunk,
  getUnanalyzedChunksPerCall,
} from "@/backend/data/callRepository";
import { Console } from "console";
import fs from "fs";
import { getCurrentTime } from "@/utils/datetime";

// Constants
const ANALYSIS_CHUNK_MIN_LENGTH: number = 200;
const ASSISTENT_ID = "asst_6j3mCmqHeBm1GQP0T8llXTMm";
const WARNING_AUDIO = "@assets/warning_sound_bite.mp3";

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
  const newThread = await openai.beta.threads.create();
  await createCallWithUserAndThreadId(
    callDetails.call_control_id,
    newThread.id,
    userId,
    callDetails.start_time
  );

  // start transcription
  const telnyxCall = new telnyx.Call({
    call_control_id: callDetails.call_control_id,
  });
  try {
    await telnyxCall.transcription_start({ language: "en" });
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

    if (analysisResult.score >= 80) {
      console.log("Scam detected!");
      logger.log(
        "\x1b[31m%s\x1b[0m",
        `[${getCurrentTime()}] Scam detected!!! Warning the user...`
      );
      playWarningSound(call_control_id);
    }
  }

  return;
}

async function analyzeTranscription(
  transcriptionText: string,
  threadId: string
): Promise<AnalysisOutput> {
  try {
    // Create message in the thread
    const message = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: transcriptionText,
    });

    // Start analysis run
    let run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTENT_ID,
    });

    // Wait for the analysis to complete
    while (["queued", "in_progress", "cancelling"].includes(run.status)) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      run = await openai.beta.threads.runs.retrieve(run.thread_id, run.id);
    }

    if (run.status === "completed") {
      // Retrieve the last message of the thread with analysis results
      const messages = await openai.beta.threads.messages.list(run.threadId);
      const lastMessage = messages.data[messages.data.length - 1];
      const result = lastMessage.content[0]["text"].value;

      // Parse the JSON result and log
      const parsedResult: AnalysisOutput = JSON.parse(result);
      logger.log(parsedResult);
      return parsedResult;
    } else {
      throw new Error(`Analysis failed with status: ${run.status}`);
    }
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrowing error to be handled by the caller
  }
}

async function playWarningSound(callControlId: string) {
  const telnyxCall = new telnyx.Call({
    call_control_id: callControlId,
  });
  try {
    telnyxCall.playback_start({
      audio_url: WARNING_AUDIO,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function handleHangupCall() {
  // Service logic to handle call hangup
}
