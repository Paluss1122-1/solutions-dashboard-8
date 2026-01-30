export async function handler(event) {
  try {
    let body;
    try {
      body = JSON.parse(event.body ?? "{}");
    } catch {
      return { statusCode: 400, body: JSON.stringify({ error: "Bad request" }) };
    }

    const { username, password, action, key, value } = body;
    if (!username || !password) {
      return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_ROLE_KEY = process.env.SUPABASE_KEY;

    const res = await fetch(`${SUPABASE_URL}/functions/v1/getsettings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        localusername: username,
        password,
        action,   // "load" | "save"
        key,
        value,
      }),
    });

    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify({ error: "Access denied" }) };
    }

    const data = await res.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
      body: JSON.stringify(data),
    };
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Serverfehler BACKEND" }),
    };
  }
}
