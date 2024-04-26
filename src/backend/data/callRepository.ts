import { supabase } from "@/config/clients";

export async function getUserByPhoneNumber(
  phoneNumber: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("users")
    .select("user_id")
    .eq("phone_number", phoneNumber)
    .single();
  return data.user_id;
}
