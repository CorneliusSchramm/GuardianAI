import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import Telnyx from "telnyx";
import { Database } from "@/backend/models/supabase";

export const telnyx = Telnyx(process.env.TELNYX_BEARER);
export const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY });
export const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY // todo: change to SUPABASE_SERVICE_KEY
);
