import OpenAI from "openai";

const OPEN_API_KEY = process.env.OPEN_API_KEY;
const openai = new OpenAI({ apiKey: OPEN_API_KEY });

export async function POST(request: Request) {
  // Log request headers for debugging
  console.log(request.headers);

  // Parse the request body from JSON
  const requestData = await request.json();
  console.log("Request Data", requestData);

  // Extract the base64-encoded audio data and file type from the request
  const base64AudioData = requestData.audio_data.split(";base64,").pop();
  const fileType = requestData.file_type;
  console.log("File Type", fileType);

  // Convert the base64 string to a Buffer
  const audioBuffer = Buffer.from(base64AudioData, "base64");

  try {
    // Attempt to transcribe the audio using the OpenAI API

    const transcription = await openai.audio.transcriptions.create({
      file: new File([audioBuffer], `audioData.${fileType}`),
      model: "whisper-1",
    });

    console.log("Transcription Text:", transcription.text);

    // Further processing with the transcription text
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "How shady/malicious is this request. Please only answer in percent of shadyness like 6% or 16% and provide reasoning. Answer in a json format with two keys 'score' (the percentage) and 'reasoning' a few key words how you got to this score.",
        },
        {
          role: "user",
          content: transcription.text,
        },
      ],
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
    });

    // Extracting and returning the result

    const result = JSON.parse(completion.choices[0].message.content);
    result.transcription = transcription.text;
    console.log(result);
    return new Response(JSON.stringify(result), {
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
