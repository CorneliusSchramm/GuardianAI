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
    // Ensure there are no active runs on the thread
    // await waitForActiveRunsToComplete(threadId);

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
    let result;
    if (run.status === "completed") {
      console.log("Run completed", run.id, run.status);
      // Retrieve the last message of the thread with analysis results
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      console.log("Messages:", messages);
      for (const message of messages.data.reverse()) {
        // console.log(`${message.role} > ${message.content[0]["text"].value}`);
        result = message.content[0]["text"].value;
      }

      // TODO: figure out why this does not work:
      //   const latestMessage = messages.data[0];
      //   const result = latestMessage.content[0]["text"].value;
      console.log("AI Analysis result:", result);

      // Parse the JSON result and return
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

async function waitForActiveRunsToComplete(threadId) {
  let runs = await openai.beta.threads.runs.list(threadId);
  let activeRun = runs.data.find((run) =>
    ["queued", "in_progress", "cancelling"].includes(run.status)
  );

  while (activeRun) {
    console.log(`Waiting for run ${activeRun.id} to complete...`);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before checking again
    runs = await openai.beta.threads.runs.list(threadId);
    activeRun = runs.data.find((run) =>
      ["queued", "in_progress", "cancelling"].includes(run.status)
    );
  }
}
