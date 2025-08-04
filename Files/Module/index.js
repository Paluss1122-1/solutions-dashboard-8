import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase-Initialisierung für Netlify
// Die Umgebungsvariablen werden über das Script-Tag in der HTML-Datei verfügbar gemacht
const SUPABASE_URL = window.SUPABASE_URL;
const SUPABASE_KEY = window.SUPABASE_KEY;

// Prüfe, ob die Umgebungsvariablen verfügbar sind
if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Supabase-Umgebungsvariablen sind nicht verfügbar. Bitte stellen Sie sicher, dass SUPABASE_URL und SUPABASE_KEY in Netlify konfiguriert sind.');
}

// Supabase-Client erstellen
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Nutzer aus Supabase laden
let users = [];

async function ladeUsers() {
    if (!supabase) {
        console.error('Supabase-Client ist nicht verfügbar');
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('users')
            .select('username, password, displayname, allowedcookies, bgcolor');

        if (error) {
            console.error('Fehler beim Laden der Nutzer:', error.message);
            return;
        }

        users = data || [];
        console.log('Geladene Nutzer:', users);
        window.users = users;
    } catch (err) {
        console.error('Unerwarteter Fehler:', err);
    }
}

// Lade die Nutzer beim Start
ladeUsers();
// Fallback: Wenn nach 5 Sekunden keine Nutzer geladen sind, trotzdem starten
setTimeout(() => {
    start();
}, 2000);


async function nutzerdatenAendern(username, neueDaten) {
    try {
        // Nutzer in Supabase updaten
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

        console.log('Nutzerdaten erfolgreich aktualisiert:', data);
        return true;
    } catch (err) {
        console.error('Unerwarteter Fehler beim Ändern der Nutzerdaten:', err);
        return false;
    }
}

// Funktion global verfügbar machen
window.nutzerdatenAendern = nutzerdatenAendern;


// Hilfsfunktionen für Browser-Erkennung
function getBrowserName() {
    const userAgent = navigator.userAgent;

    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    if (userAgent.includes('Trident')) return 'Internet Explorer';

    return 'Unknown';
}

window.SendAnalyticsStep = async function (action) {
    let user = null;
    window.console.log(action);
    try {
        user = window.founduser.username;
    } catch (e) {
        console.error("Fehler beim Auslesen des Benutzernamens:", e);
        user = null;
    }

    // Prüfe, ob die Seite nicht lokal läuft
    const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    if (!isLocal) {
        try {
            const { error } = await supabase.from('analytics').insert([{
                browser: getBrowserName(),
                device: (navigator.userAgentData && navigator.userAgentData.platform) || navigator.userAgent,
                datum: new Date().toISOString(),
                link: window.location.href,
                username: user,
                Action: action
            }]);
            if (error) {
                await supabase.from('Fehlerberichte').insert([{
                    userAgent: (navigator.userAgentData && navigator.userAgentData.platform) || navigator.userAgent,
                    zeit: new Date().toISOString(),
                    fehler: error.message || error
                }]);
            }
        } catch (err) {
            await supabase.from('Fehlerberichte').insert([{
                userAgent: (navigator.userAgentData && navigator.userAgentData.platform) || navigator.userAgent,
                zeit: new Date().toISOString(),
                fehler: err.message || err
            }]);
        }
    }
}

async function update() {
    try {
        const { data, error } = await supabase
            .from('general')
            .select('*')
            .single();

        if (error) {
            console.error('Fehler beim Laden der allgemeinen Daten:', error.message);
            return;
        }

        window.generalData = data;


        let showMaintenance = false;
        const active = data && data.Wartungsarbeiten;

        if (founduser) {
            try {
                // Nur Paluss1122 sieht KEINE Wartungsarbeiten, alle anderen schon
                if (founduser.username === "Paluss1122" && active) {
                    showMaintenance = false;
                    document.title = 'Dashboard'
                } else {
                    document.title = active ? `Wartungsarbeiten (bis ${data.WartungsarbeitenZeit})` : "Dashboard";
                    showMaintenance = active;
                }
            } catch (e) {
                document.title = active ? `Wartungsarbeiten (bis ${data.WartungsarbeitenZeit})` : "Dashboard";
                console.error("Fehler beim Parsen des Benutzers:", e);
                showMaintenance = active;
            }
        } else if (localStorage.getItem('username')) {
            if (localStorage.getItem('username') === "Paluss1122" && active) {
                showMaintenance = false;
                document.title = 'Dashboard'
            } else {
                document.title = active ? `Wartungsarbeiten (bis ${data.WartungsarbeitenZeit})` : "Dashboard";
                showMaintenance = active;
            }
        } else {
            document.title = active ? `Wartungsarbeiten (bis ${data.WartungsarbeitenZeit})` : "Dashboard";
            showMaintenance = active;
        }

        const maintenanceFrame = document.getElementById("maintenance-frame");
        if (maintenanceFrame) {
            if (showMaintenance == true) {
                maintenanceFrame.style.display = 'flex';
                maintenanceFrame.style.opacity = '1'
            } else {
                maintenanceFrame.style.opacity = '1'
                setTimeout(() => {
                    maintenanceFrame.style.display = 'none';
                }, 1000);
            }
        }
        document.getElementById("time-ws").innerText = data.WartungsarbeitenZeit;
        document.getElementById("why-ws").innerText = data.Grund;
    } catch (err) {
        console.error('Unerwarteter Fehler:', err);
    }
}

setInterval(() => {
    update()
}, 2000);