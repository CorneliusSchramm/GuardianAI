import { openai, telnyx } from "@/config/clients";
import { TelnyxEventPayload, AnalysisOutput } from "@/backend/models/types";
import {
  getUserByPhoneNumber,
  getCallByCallControlId,
  createCallWithUserAndThreadId,
  createTranscriptionChunk,
  getUnanalyzedChunksPerCall,
} from "@/backend/data/callRepository";

const ANALYSIS_CHUNK_MIN_LENGTH: number = 200;
const ASSISTENT_ID = "asst_6j3mCmqHeBm1GQP0T8llXTMm";

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
  }

  return;
}

async function analyzeTranscription(
  transcriptionText,
  callControlId,
  threadId
): Promise<AnalysisOutput> {
  try {
    const message = await openai.beta.threads.messages.create(thread_id, {
      role: "user",
      content: transcription_text,
    });

    let run = await openai.beta.threads.runs.create(thread_id, {
      assistant_id: assistant_id,
      // instructions: "Please provide your assessment of the full phone call in the JSON format outlined in the instructions you received.",
    });

    while (["queued", "in_progress", "cancelling"].includes(run.status)) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
      run = await openai.beta.threads.runs.retrieve(run.thread_id, run.id);
    }

    let result;

    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      for (const message of messages.data.reverse()) {
        // console.log(`${message.role} > ${message.content[0]["text"].value}`);
        result = message.content[0]["text"].value;
      }
    } else {
      console.log(run.status);
    }

    // Extracting and returning the result
    result = JSON.parse(result);

    logger.log({
      score: result.score,
      confidence: result.confidence,
      reasoning: result.reasoning,
    });

    result.transcription = transcription_text;

    console.log(result);

    if (result.score > 80) {
      console.log("Scam detected!");
      logger.log(
        "\x1b[31m%s\x1b[0m",
        `[${getCurrentTime()}] Scam detected!!! Warning the user...`
      );
      playWarningSound(call_control_id);
    }

    return new Response(result, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function handleHangupCall() {
  // Service logic to handle call hangup
}
