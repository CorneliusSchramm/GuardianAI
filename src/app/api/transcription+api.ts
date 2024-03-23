// import OpenAI from "openai";

// const OPEN_API_KEY = process.env.OPEN_API_KEY;
// const openai = new OpenAI({ apiKey: OPEN_API_KEY });

export async function GET(request: Request) {
  //   const body = await request.formData();
  //   console.log(body.get("audio_data"));
  //   const audioData = body.get("audio_data");

  //   const transcription = await openai.audio.transcriptions.create({
  //     file: new File([audioData], "audioData.webm"),
  //     model: "whisper-1",
  //   });

  return Response.json({ transcription: "world" });
}
