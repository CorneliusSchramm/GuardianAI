import { openai } from "@/config/clients";
import { AnalysisOutput } from "@/backend/models/types";

const ASSISTENT_ID = "asst_6j3mCmqHeBm1GQP0T8llXTMm";

export async function createThread() {
  const newThread = await openai.beta.threads.create();
  return newThread;
}

export async function analyzeTranscription(
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
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      const lastMessage = messages.data[messages.data.length - 1];
      const result = lastMessage.content[0]["text"].value;

      // Parse the JSON result and log
      const parsedResult: AnalysisOutput = JSON.parse(result);
      return parsedResult;
    } else {
      throw new Error(`Analysis failed with status: ${run.status}`);
    }
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrowing error to be handled by the caller
  }
}
