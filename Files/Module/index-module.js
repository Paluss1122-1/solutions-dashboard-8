// Nutzer-Array
let users = [];

// Nutzer von Netlify Function laden
async function ladeUsers() {
    try {
        const response = await fetch('/.netlify/functions/SDB8/get-users');
        
        if (!response.ok) {
            console.error('Fehler beim Laden der Nutzer');
            const problem = document.getElementById('problem');
            problem.style.display = 'block';
            
            // Prüfe Internetverbindung
            fetch("https://jsonplaceholder.typicode.com/posts")
                .then(res => {
                    if (!res.ok) {
                        problem.innerText = "Server konnte nicht erreicht werden.";
                    }
                    return res.json();
                })
                .then(() => {
                    problem.innerText = "An deinem Internet liegt es nicht... Es wird nach weiteren möglichen Ursachen für das Problem gesucht.";
                    
                    const ls = localStorage;
                    if (!ls.getItem('username')) {
                        problem.innerText = "Du bist Abgemeldet!";
                        localStorage.clear();
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else if (!ls.getItem('password')) {
                        problem.innerText = "Du bist Abgemeldet!";
                        localStorage.clear();
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else if (users.length === 0) {
                        problem.innerText = 'Es gibt aktuell Probleme mit den Servern!';
                    }
                })
                .catch(error => {
                    if (
                        error.message.includes("Failed to fetch") ||
                        error.message.includes("NetworkError") ||
                        error.message.includes("Load failed")
                    ) {
                        problem.innerText = "Du hast keine Internetverbindung! Stelle eine Verbindung her und lade die Website neu!";
                    }
                });
            return;
        }

        const data = await response.json();
        users = data.users || [];
        window.users = users;
    } catch (err) {
        console.error('Unerwarteter Fehler:', err);
    }
}

// Lade die Nutzer beim Start
ladeUsers();

// Fallback: Wenn nach 2 Sekunden keine Nutzer geladen sind, trotzdem starten
setTimeout(() => {
    start();
}, 2000);

// Nutzerdaten ändern über Netlify Function
async function nutzerdatenAendern(username, neueDaten) {
    try {
        const response = await fetch('/.netlify/functions/SDB8/update-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, neueDaten })
        });

        if (!response.ok) {
            console.error('Fehler beim Aktualisieren der Nutzerdaten');
            return false;
        }

        const result = await response.json();

        // Auch im lokalen users-Array aktualisieren
        users = users.map(user => {
            if (user.username === username) {
                return { ...user, ...neueDaten };
            }
            return user;
        });

        // Wenn der aktuell eingeloggte Nutzer geändert wurde, founduser aktualisieren
        if (window.founduser && window.founduser.username === username) {
            window.founduser = { ...window.founduser, ...neueDaten };
        }

        return true;
    } catch (err) {
        console.error('Fehler:', err);
        return false;
    }
}

// Funktion global verfügbar machen
window.nutzerdatenAendern = nutzerdatenAendern;

// Fehler melden über Netlify Function
async function reporterror(errorMessage) {
    try {
        const userAgent = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.userAgent;
        
        await fetch('/.netlify/functions/SDB8/report-error', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ errorMessage, userAgent })
        });
    } catch (err) {
        console.error('Unerwarteter Fehler beim Senden des Fehlerberichts:', err);
    }
}

window.reporterror = reporterror;

// Browser-Erkennung
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

// Analytics über Netlify Function senden
window.SendAnalyticsStep = async function (action) {
    let user = null;
    if (window.founduser || localStorage.getItem('username')) {
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
            await fetch('/.netlify/functions/SDB8/send-analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    browser: getBrowserName(),
                    device: (navigator.userAgentData && navigator.userAgentData.platform) || navigator.userAgent,
                    link: window.location.href,
                    username: user,
                    action: action
                })
            });
        } catch (err) {
            console.error('Fehler beim Senden der Analytics:', err);
        }
    }
}

// General-Daten laden und Update-Logik
async function update() {
    try {
        const response = await fetch('/.netlify/functions/SDB8/get-general');
        
        if (!response.ok) {
            console.error('Fehler beim Laden der allgemeinen Daten');
            return;
        }

        const data = await response.json();
        window.generalData = data;
        window.released = data.released;

        if (data.released !== false) {
            let showMaintenance = false;
            const active = data && data.Wartungsarbeiten;

            if (window.founduser) {
                try {
                    if (window.founduser.username === "Paluss1122" && active) {
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
                    maintenanceFrame.style.opacity = '0';
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

            startCountdown();
        } else {
            const countdown = document.getElementById('countdown');
            if (countdown) {
                countdown.remove();
            }
        }
    } catch (err) {
        console.error('Unerwarteter Fehler:', err);
    }
}