import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const OPEN_API_KEY = process.env.OPEN_API_KEY;
export const openai = new OpenAI({ apiKey: OPEN_API_KEY });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
