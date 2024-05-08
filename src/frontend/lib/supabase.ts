import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/models/supabase";

// todo: enable RLS otherwise anon key not save. also put in const
const supabaseUrl = "https://kjkdpsfjyswkowwymfge.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqa2Rwc2ZqeXN3a293d3ltZmdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM0MzEwNjksImV4cCI6MjAyOTAwNzA2OX0.pf2XZ48QCvgmYR0kqfoGrjsSCyecxsQeignFbWHeg9U";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
