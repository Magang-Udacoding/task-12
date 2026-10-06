import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePubKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePubKey) {
    throw new Error('Supabase env variable not configured');
}

export const supabase = createClient(
    supabaseUrl,
    supabasePubKey
);