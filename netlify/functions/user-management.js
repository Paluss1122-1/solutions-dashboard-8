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

        const { username, password, updateUser, neueDaten } = body;

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

        // 🔹 Alle Nutzer abrufen
        if (!updateUser) {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*`, {
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

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify(data),
            };
        }

        // 🔹 Nutzer aktualisieren
        if (updateUser && neueDaten) {
            const res = await fetch(
                `${SUPABASE_URL}/rest/v1/users?username=eq.${encodeURIComponent(updateUser)}&select=*`,
                {
                    method: "PATCH",
                    headers: {
                        "apikey": SERVICE_ROLE_KEY,
                        "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
                        "Content-Type": "application/json",
                        "Prefer": "return=representation",
                    },
                    body: JSON.stringify(neueDaten),
                }
            );

            if (!res.ok) {
                return {
                    statusCode: 500,
                    headers: corsHeaders,
                    body: JSON.stringify({ error: "Update failed" }),
                };
            }

            const data = await res.json();

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({ success: true, updatedUser: data }),
            };
        }

        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Invalid request" }),
        };

    } catch (err) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Serverfehler BACKEND", details: err.message }),
        };
    }
}