// Proxy-Funktion, ruft Supabase Edge Function auf
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const SUPABASE_URL = "https://empsgwnjxxhzyudvxyxg.supabase.co/functions/v1/user-management";
const SERVICE_ROLE_KEY = process.env.SUPABASE_KEY;

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const body = await req.json();

    const res = await fetch(SUPABASE_EDGE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY ?? ""}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server Error", details: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});