const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function nutzerdatenAendern(username, neueDaten) {
    try {
        const { data, error } = await supabase
            .from('users')
            .update(neueDaten)
            .eq('username', username);

        if (error) {
            console.error('Fehler beim Aktualisieren der Nutzerdaten:', error.message);
            return false;
        }

        // Auch im lokalen users-Array aktualisieren
        users = users.map(user => {
            if (user.username === username) {
                return { ...user, ...neueDaten };
            }
            return user;
        });

        // Wenn der aktuell eingeloggte Nutzer geändert wurde, founduser aktualisieren
        if (founduser && founduser.username === username) {
            founduser = { ...founduser, ...neueDaten };
        }

        return true;
    } catch (err) {
        return false;
    }
}