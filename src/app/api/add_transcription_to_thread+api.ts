import OpenAI from "openai";

const OPEN_API_KEY = process.env.OPEN_API_KEY;
const openai = new OpenAI({ apiKey: OPEN_API_KEY });

export async function POST(request: Request) {
  // Log request headers for debugging
  console.log(request.headers);

  // Parse the request body from JSON
  const requestData = await request.json();
  console.log(requestData);

  const thread_id = requestData.thread_id
  const assistant_id = requestData.assistant_id

  let transcription_text = requestData.transcription || "";

  try {
    if (transcription_text === "") {
      // Extract the base64-encoded audio data and file type from the request
      const base64AudioData = requestData.audio_data.split(";base64,").pop();
      const fileType = requestData.file_type;
      console.log("File Type", fileType);

      // Convert the base64 string to a Buffer
      const audioBuffer = Buffer.from(base64AudioData, "base64");

      // Attempt to transcribe the audio using the OpenAI API
      const transcription = await openai.audio.transcriptions.create({
        file: new File([audioBuffer], `audioData.${fileType}`),
        model: "whisper-1",
      });

      console.log("Transcription Text:", transcription.text);
      transcription_text = transcription.text;
    }

    const message = await openai.beta.threads.messages.create(
      thread_id,
      {
        role: "user",
        content: transcription_text,
      }
    );

    let run = await openai.beta.threads.runs.create(
      thread_id,
      {
        assistant_id: assistant_id,
        // instructions: "Please provide your assessment of the full phone call in the JSON format outlined in the instructions you received.",
      }
    );

    while (['queued', 'in_progress', 'cancelling'].includes(run.status)) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
      run = await openai.beta.threads.runs.retrieve(
        run.thread_id,
        run.id
      );
    }

    let result;

    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(
        run.thread_id
      );
      for (const message of messages.data.reverse()) {
        console.log(`${message.role} > ${message.content[0]["text"].value}`);
        result = message.content[0]["text"].value;
      }
    } else {
      console.log(run.status);
    }

    // Extracting and returning the result

    result.transcription = transcription_text;
    console.log(result);
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
