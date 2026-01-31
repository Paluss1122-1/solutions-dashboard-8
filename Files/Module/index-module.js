setTimeout(() => {
    start();
}, 500);

async function nutzerdatenAendern(username, neueDaten) {
    try {
        const response = await fetch('/.netlify/functions/user-management', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'Plus1122',
                password: '123Maths!',
                updateUser: username,
                neueDaten: neueDaten
            })
        });

        if (!response.ok) {
            console.error('Fehler beim Aktualisieren der Nutzerdaten');
            return false;
        }

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

        await fetch('/.netlify/functions/report-error', {
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

function getBrowserName() {
    const userAgent = navigator.userAgent;

    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Trident')) return 'Internet Explorer';

    return 'Unknown';
}

// Analytics über Netlify Function senden
window.SendAnalyticsStep = async function (action) {
    let user = window.founduser || localStorage.getItem('username') || null;

    const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";

    if (!isLocal) {
        try {
            await fetch('/.netlify/functions/send-analytics', {
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

async function update() {
    try {
        const response = await fetch('/.netlify/functions/get-general');

        if (!response.ok) {
            console.error('Fehler beim Laden der allgemeinen Daten');
            return;
        }

        const data = await response.json();
        window.generalData = data;
        window.released = data.released;

        let showMaintenance = false;
        const active = data && data.Wartungsarbeiten;

        if (window.founduser) {
            try {
                if (window.founduser.username === "Plus1122" && active) {
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
            if (localStorage.getItem('username') === "Plus1122" && active) {
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
    } catch (err) {
        console.error('Unerwarteter Fehler:', err);
    }
}

window.update = update