export async function handler(event) {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
    };

    // Handle OPTIONS request
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: "",
        };
    }

    try {
        // Parse request body
        let body = {};
        try {
            body = JSON.parse(event.body || "{}");
        } catch {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ error: "Invalid JSON" }),
            };
        }

        const { username, password, action = "load", key, value } = body;

        // Validate credentials
        const valid = username === "Plus1122" && password === "123Maths!";

        if (!valid) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({ error: "Access denied" }),
            };
        }

        const SUPABASE_URL = process.env.SUPABASE_URL;
        const SERVICE_ROLE_KEY = process.env.SUPABASE_KEY;

        // 🔹 LADEN
        if (action === "load") {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/general?limit=1`, {
                method: "GET",
                headers: {
                    "apikey": SERVICE_ROLE_KEY,
                    "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                return {
                    statusCode: 500,
                    headers: corsHeaders,
                    body: JSON.stringify({ error: "Database error" }),
                };
            }

            const data = await res.json();
            const general = data.length > 0 ? data[0] : null;

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({ general }),
            };
        }

        // 🔹 SPEICHERN
        if (action === "save") {
            if (!key || value === undefined) {
                return {
                    statusCode: 400,
                    headers: corsHeaders,
                    body: JSON.stringify({ error: "Missing key or value for save action" }),
                };
            }

            // Check if record exists
            const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/general?select=id&limit=1`, {
                method: "GET",
                headers: {
                    "apikey": SERVICE_ROLE_KEY,
                    "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
                    "Content-Type": "application/json",
                },
            });

            if (!checkRes.ok) {
                return {
                    statusCode: 500,
                    headers: corsHeaders,
                    body: JSON.stringify({ error: "Database check failed" }),
                };
            }

            const existing = await checkRes.json();

            if (existing && existing.length > 0) {
                // UPDATE existing record
                const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/general?id=eq.${existing[0].id}`, {
                    method: "PATCH",
                    headers: {
                        "apikey": SERVICE_ROLE_KEY,
                        "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
                        "Content-Type": "application/json",
                        "Prefer": "return=minimal",
                    },
                    body: JSON.stringify({ [key]: value }),
                });

                if (!updateRes.ok) {
                    return {
                        statusCode: 500,
                        headers: corsHeaders,
                        body: JSON.stringify({ error: "Update failed" }),
                    };
                }
            } else {
                // INSERT new record
                const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/general`, {
                    method: "POST",
                    headers: {
                        "apikey": SERVICE_ROLE_KEY,
                        "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
                        "Content-Type": "application/json",
                        "Prefer": "return=minimal",
                    },
                    body: JSON.stringify({ [key]: value }),
                });

                if (!insertRes.ok) {
                    return {
                        statusCode: 500,
                        headers: corsHeaders,
                        body: JSON.stringify({ error: "Insert failed" }),
                    };
                }
            }

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({ success: true }),
            };
        }

        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Invalid action" }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Serverfehler BACKEND" }),
        };
    }
}