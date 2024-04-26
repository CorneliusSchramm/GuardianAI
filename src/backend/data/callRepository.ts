import { supabase } from "@/config/clients";

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
  return data.user_id;
}

export async function getCallByCallControlId(
  callControlId: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("calls")
    .select("call_id")
    .eq("call_control_id", callControlId)
    .maybeSingle();
  console.log("getCallByCallControlId", data);
  if (error) {
    throw new Error(error.message);
  }
  if (!data || !data.call_id) {
    return null;
  }
  return data.call_id;
}

export async function createCallWithUserAndThreadId(
  callControlId: string,
  threadId: string,
  userId: string,
  startTime: string
): Promise<string | null> {
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
