export async function handler(event) {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=30",
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
        let body;
        try {
            body = JSON.parse(event.body ?? "{}");
        } catch {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ error: "Bad request" }),
            };
        }

        const { username, password } = body;

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

        const limit = 50;
        const page = Number(event.queryStringParameters?.page || 0);
        const offset = page * limit;

        // Fetch data from Supabase REST API
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/analytics?order=datum.desc&limit=${limit}&offset=${offset}`,
            {
                method: "GET",
                headers: {
                    "apikey": SERVICE_ROLE_KEY,
                    "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

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

    } catch {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Serverfehler BACKEND" }),
        };
    }
}