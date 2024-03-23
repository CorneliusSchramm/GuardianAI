import OpenAI from "openai";

const OPEN_API_KEY = process.env.OPEN_API_KEY;
const openai = new OpenAI({ apiKey: OPEN_API_KEY });

export async function POST(request: Request) {
  const body = await request.formData();
  console.log(body.get("audio_data"));
  const audioData = body.get("audio_data");

  const transcription = await openai.audio.transcriptions.create({
    file: new File([audioData], "audioData.webm"),
    model: "whisper-1",
  });

  console.log(transcription.text);

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "How shady/malicious is this request. Please only answer in percent of shadyness like 6% or 16% and provide reasoning. Answer in a json format with two keys 'score' (the percentage) and 'reasoning' a few key words how you got to this score.",
      },
      { role: "user", content: transcription.text },
      // { role: "assistant", content: "{'score': '3%', 'reasoning': 'asking for credit card'}"},
      // { role: "user", content: body.content}
    ],
    model: "gpt-3.5-turbo-0125",
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(completion.choices[0].message.content);
  // const result = {'score': 86, "reasoning": 'hello'}
  return Response.json(result);
}
