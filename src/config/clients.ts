import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import Telnyx from "telnyx";

export const telnyx = Telnyx(process.env.TELNYX_API_KEY);
export const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY });
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY // todo: change to SUPABASE_SERVICE_KEY
);
