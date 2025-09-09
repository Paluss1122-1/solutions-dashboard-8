import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://empsgwnjxxhzyudvxyxg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtcHNnd25qeHhoenl1ZHZ4eXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MTI2NzUsImV4cCI6MjA2OTI4ODY3NX0.WvGmXzoIojeiM8l1GN_e9iRq5C5G2AURiyy96NLjnhE';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let firstSaveDone = false;

async function save() {
    const username = localStorage.getItem('username');
    if (!username) {
        console.warn('Kein username gefunden, save() wird abgebrochen');
        return;
    }

    if (!firstSaveDone) {
        // Alles außer 'username' löschen
        const username = localStorage.getItem('username'); // vorher sichern
        localStorage.clear(); // alle löschen
        if (username) localStorage.setItem('username', username); // username wieder rein

        try {
            // Daten von Supabase holen
            const { data, error } = await supabase
                .from('hausaufgaben_editor')
                .select('localstorage')
                .eq('username', username)
                .maybeSingle();

            if (error) {
                console.error('Fehler beim Laden der Daten von Supabase:', error);
            } else if (data && data.localstorage) {
                const parsedData = JSON.parse(data.localstorage);
                for (const key in parsedData) {
                    if (key !== 'username') {
                        localStorage.setItem(key, parsedData[key]);
                    }
                }
            }
        } catch (err) {
            console.error('Unbekannter Fehler beim Laden der Daten:', err);
        }

        firstSaveDone = true;
    }

    // localStorage in String packen
    let allLocalStorage = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        allLocalStorage[key] = localStorage.getItem(key);
    }
    const localStorageString = JSON.stringify(allLocalStorage);

    try {
        // Prüfen, ob Datensatz existiert
        const { data: existing, error: fetchError } = await supabase
            .from('hausaufgaben_editor')
            .select('username')
            .eq('username', username)
            .maybeSingle();

        if (fetchError) {
            console.error('Fehler beim Prüfen des Datensatzes:', fetchError);
            return;
        }

        if (existing) {
            // Datensatz existiert → update
            const { error: updateError } = await supabase
                .from('hausaufgaben_editor')
                .update({ localstorage: localStorageString })
                .eq('username', username);

            if (updateError) {
                console.error('Fehler beim Aktualisieren:', updateError);
                return;
            }
        } else {
            // Datensatz existiert nicht → insert
            const { error: insertError } = await supabase
                .from('hausaufgaben_editor')
                .insert({ username, localstorage: localStorageString });

            if (insertError) {
                console.error('Fehler beim Erstellen:', insertError.message);
                return;
            }
        }
    } catch (err) {
        console.error('Unbekannter Fehler beim Speichern:', err);
    }
}

window.save = save()

setInterval(() => {
    if (localStorage.getItem('allowedsb')) {
        save();
    }
}, 5000);
