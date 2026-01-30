export async function handler(event) {
  try {
    const { username, password } = JSON.parse(event.body || "{}");

    if (!username || !password) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" })
      };
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_ROLE_KEY = process.env.SUPABASE_KEY;

    // 1️⃣ Admin-Check (Supabase Edge Function)
    const adminRes = await fetch(`${SUPABASE_URL}/functions/v1/isAdmin`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        localusername: username,
        password: password
      })
    });

    const adminData = await adminRes.json();

    if (!adminData?.valid) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: "Access denied" })
      };
    }

    // 2️⃣ Analytics abrufen
    const analyticsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/analytics?order=datum.desc`,
      {
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const analytics = await analyticsRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify(analytics)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Serverfehler" })
    };
  }
}