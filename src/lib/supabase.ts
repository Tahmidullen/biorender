import { createClient } from "@supabase/supabase-js";

// These values come from your .env.local file.
// NEXT_PUBLIC_ prefix means they are safe to expose in the browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// createClient sets up the connection to your Supabase project.
// We export it so any file in the project can import and use it.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
