import { helloWorld } from "@/helloWorld";

export async function GET(request: Request) {
  const hello = helloWorld();
  return Response.json({ transcription: hello });
}
