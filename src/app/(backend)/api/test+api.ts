import { helloWorld } from "@/helloWorld";

export async function GET(request: Request) {
    return new Response(helloWorld());
}
