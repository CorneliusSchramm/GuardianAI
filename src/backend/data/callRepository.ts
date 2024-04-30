import { supabase } from "@/config/clients";
import { AnalysisOutput } from "@/backend/models/types";

export async function getUserByPhoneNumber(
  phoneNumber: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("users")
    .select("user_id")
    .eq("phone_number", phoneNumber)
    .maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  if (!data || !data.user_id) {
    return;
  }
  return data.user_id;
}

export async function getCallByCallControlId(callControlId: string) {
  const { data, error } = await supabase
    .from("calls")
    .select("call_id, thread_id, user_id")
    .eq("call_control_id", callControlId)
    .maybeSingle();
  console.log("getCallByCallControlId", data);
  if (error) {
    throw new Error(error.message);
  }
  if (!data || !data.call_id) {
    return null;
  }
  return data;
}

export async function createCallWithUserAndThreadId(
  callControlId: string,
  threadId: string,
  userId: string,
  startTime: string
) {
  const { data, error } = await supabase
    .from("calls")
    .insert([
      {
        user_id: userId,
        call_control_id: callControlId,
        thread_id: threadId,
        call_start_datetime: startTime,
      },
    ])
    .select("call_id")
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data.call_id;
}

export async function createTranscriptionChunk(
  callId: number,
  text: string
): Promise<number> {
  const { data, error } = await supabase
    .from("transcription_chunks")
    .insert([
      {
        call_id: callId,
        transcription_chunk: text,
        analyzed: false,
      },
    ])
    .select("transcription_chunk_id")
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data.transcription_chunk_id;
}

export async function getUnanalyzedChunksPerCall(callId: number) {
  const { data, error } = await supabase
    .from("transcription_chunks")
    .select(`transcription_chunk_id, transcription_chunk, analyzed`)
    .eq("call_id", callId)
    .eq("analyzed", false)
    .order("created_at", { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function saveAnanlysisChunk(analysisChunk: AnalysisOutput) {
  const { data, error } = await supabase
    .from("analyses_chunks")
    .insert(analysisChunk)
    .select()
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function updateTranscriptionChunksAsAnalyzed(
  transcriptionChunkIds: number[]
) {
  const { data, error } = await supabase
    .from("transcription_chunks")
    .update({ analyzed: true })
    .in("transcription_chunk_id", transcriptionChunkIds);
  if (error) {
    throw new Error(error.message);
  }
}

export async function linkTranscriptionChunksToAnalysisChunk(
  transcriptionChunkIds: number[],
  analysesChunkId: number
) {
  const { data, error } = await supabase
    .from("transcription_chunks")
    .update({ analyses_chunk_id: analysesChunkId })
    .in("transcription_chunk_id", transcriptionChunkIds);
  if (error) {
    throw new Error(error.message);
  }
}
