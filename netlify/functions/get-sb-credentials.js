// netlify/functions/get-data.js
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  const { data, error } = await supabase.from("users").select("*");
  return new Response(JSON.stringify({ data, error }), {
    headers: { "Content-Type": "application/json" },
  });
});