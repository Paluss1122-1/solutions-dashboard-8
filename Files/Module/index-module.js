import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase-Initialisierung für Netlify
// Die Umgebungsvariablen werden über das Script-Tag in der HTML-Datei verfügbar gemacht
const SUPABASE_URL = 'https://empsgwnjxxhzyudvxyxg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtcHNnd25qeHhoenl1ZHZ4eXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MTI2NzUsImV4cCI6MjA2OTI4ODY3NX0.WvGmXzoIojeiM8l1GN_e9iRq5C5G2AURiyy96NLjnhE';
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
            const problem = document.getElementById('problem')
            problem.style.display = 'block';
            fetch("https://jsonplaceholder.typicode.com/posts")
                .then(response => {
                    if (!response.ok) {
                        problem.innerText = "Server konnte nicht erreicht werden.";
                    }
                    return response.json();
                })
                .then(data => {
                    problem.innerText =
                        "An deinem Internet liegt es nicht... Es wird nach weiteren möglichen Ursachen für das Problem gesucht.";
                    const ls = localStorage
                    if (!ls.getItem('username')) {
                        problem.innerText = "Du bist Abgemeldet!"
                        localStorage.clear();
                        setTimeout(() => {
                            window.location.reload()
                        }, 1000);
                    } else if (!ls.getItem('password')) {
                        problem.innerText = "Du bist Abgemeldet!"
                        localStorage.clear();
                        setTimeout(() => {
                            window.location.reload()
                        }, 1000);
                    } else if (users = []) {
                        problem.innerText = 'Es gibt aktuell Problem mit den Servern!'
                    }
                })
                .catch(error => {
                    if (
                        error.message.includes("Failed to fetch") ||
                        error.message.includes("NetworkError") ||
                        error.message.includes("Load failed")
                    ) {
                        problem.innerText =
                            "Du hast keine Internetverbindung! Stelle eine Verbindung her und lade die Website neu!";
                    }
                });
        }

        users = data || [];
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

        return true;
    } catch (err) {
        return false;
    }
}

// Funktion global verfügbar machen
window.nutzerdatenAendern = nutzerdatenAendern;

async function reporterror(errorMessage) {
    try {
        const { error } = await supabase.from('Fehlerberichte').insert([{
            userAgent: (navigator.userAgentData && navigator.userAgentData.platform) || navigator.userAgent,
            zeit: new Date().toISOString(),
            fehler: errorMessage
        }]);
        if (error) {
            console.error('Fehler beim Senden des Fehlerberichts:', error.message);
        }
    } catch (err) {
        console.error('Unerwarteter Fehler beim Senden des Fehlerberichts:', err);
    }
}

window.reporterror = reporterror;

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
    if (founduser || localStorage.getItem('username')) {
        try {
            user = localStorage.getItem('username');
        } catch (e) {
            console.error("Fehler beim Auslesen des Benutzernamens:", e);
            user = null;
        }
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
        window.released = data.released;
        if (!data.released === false) {
            let showMaintenance = false;
            const active = data && data.Wartungsarbeiten;

            if (founduser) {
                try {
                    if (founduser.username === "Paluss1122" && active) {
                        showMaintenance = false;
                        document.title = 'Dashboard';
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
                    document.title = 'Dashboard';
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
                if (showMaintenance === true) {
                    maintenanceFrame.style.display = 'flex';
                    maintenanceFrame.style.opacity = '1';
                } else {
                    maintenanceFrame.style.opacity = '1';
                    setTimeout(() => {
                        maintenanceFrame.style.display = 'none';
                    }, 1000);
                }
            }

            document.getElementById("time-ws").innerText = data.WartungsarbeitenZeit;
            document.getElementById("why-ws").innerText = data.Grund;
        }

        // Falls Released == false -> Countdown anzeigen
        if (data.released === false) {
            const countdown = document.getElementById('countdown');
            countdown.style.zIndex = '10000';

            // Zielzeit für Countdown global setzen
            if (data.releasedate) {
                window.releaseTimestamp = new Date(data.releasedate).getTime();
            }
        }
    } catch (err) {
        console.error('Unerwarteter Fehler:', err);
    }
}

let released

// Update alle 2 Sekunden für generelle Daten
if (released == null) {
    update();
} else if (released == false) {
    setInterval(update, 60000);
} else if (released == true) {
    setInterval(update, 2000);
}

async function startCountdown() {
    let lastValue = "";

    const interval = setInterval(async () => {
        if (!window.releaseTimestamp) return;

        const cd = document.getElementById("cd");
        const now = new Date().getTime();
        const distance = window.releaseTimestamp - now;
        if (!cd) return;
        if (cd.style.opacity === "0") {
            cd.style.opacity = "1";
        }

        let text;
        if (distance <= 0) {
            text = "Bereit!";
            try {
                // Erste Zeile updaten → released = true
                const { data, error } = await supabase
                    .from("general")
                    .update({ released: true })
                    .order("id", { ascending: true })
                    .limit(1);

                if (error) {
                    console.error("Fehler beim Aktualisieren:", error.message);
                    return false;
                }

                // Timer stoppen, damit nicht jede Sekunde erneut geschrieben wird
                clearInterval(interval);
                return true;
            } catch (err) {
                console.error("Unerwarteter Fehler:", err);
                return false;
            }
        } else {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            text = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        // Effekt nur bei Änderung triggern
        if (text !== lastValue) {
            cd.innerText = text;
            cd.classList.remove("countdown-change");
            void cd.offsetWidth; // reflow force für restart
            cd.classList.add("countdown-change");
            lastValue = text;
        }
    }, 1000);
}

startCountdown();
