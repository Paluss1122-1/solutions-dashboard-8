export async function handler(event) {
    try {
        let body = {};
        try {
            body = JSON.parse(event.body || "{}");
        } catch {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid JSON" }),
            };
        }

        const { username, password, updateUser, neueDaten } = body;

        if (!username || !password) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: "Unauthorized" }),
            };
        }

        // Supabase Edge Function aufrufen
        const res = await fetch(`${process.env.SUPABASE_URL}/functions/v1/user-management`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.SUPABASE_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
                updateUser,
                neueDaten
            }),
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            return { statusCode: res.status, body: JSON.stringify({ error: errData.error || "Access denied" }) };
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