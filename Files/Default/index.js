const loginform1 = document.getElementById('login-form-1');
const loginform2 = document.getElementById('login-form-2');
const loginform3 = document.getElementById('login-form-3');
const loginform4 = document.getElementById('login-form-4');
const loginform5 = document.getElementById('login-form-5');
const loginContainer = document.getElementById('login-container');
const linkcontainer = document.getElementById('link-container');
const settingsframe = document.getElementById('settingsframe');
let founduser = null;
const Hinweis1 = document.getElementById('Hinweis-1');
const Hinweis2 = document.getElementById('Hinweis-2');
const Hinweis3 = document.getElementById('Hinweis-3');
const black = document.getElementById('black');
const bgsetting = document.getElementById('bg-setting');
const intro = document.getElementById('intro');
const startp = document.getElementById('start');
const begruessung = document.getElementById('Begrüßung');
const setdisplayname = document.getElementById('set-displayname');
const f = document.getElementById('f');
const dashboard = document.getElementById('dashboard');
const bgiframe = document.getElementById('bg-iframe');
const usname = document.getElementById('usname')
const infocontainer = document.getElementById('info-container')
const infotitle = document.getElementById('info-title');
const infotext = document.getElementById('info-text');
const username = document.getElementById('username');
const password = document.getElementById('password');
const displayname = document.getElementById('displayname');

function settings() {
    if (settingsframe.style.display == 'none') {
        window.SendAnalyticsStep('Einstellungen geöffnet');
        settingsframe.style.display = 'block';
        setTimeout(() => {
            settingsframe.style.opacity = '1'
        }, 10);
        var displayname = founduser.displayname;
        if (displayname) {
            setdisplayname.value = displayname;
        }
    } else {
        window.SendAnalyticsStep('Einstellungen geschlossen');
        settingsframe.style.opacity = '0'
        setTimeout(() => {
            settingsframe.style.display = 'none';
        }, 1000);
    }
}

// Funktion, um die aktuelle Uhrzeit des Nutzers zu bekommen (im lokalen Format)
function getTageszeit() {
    const jetzt = new Date();
    const stunde = jetzt.getHours();
    const morgen = [
        { text: 'Guten Morgen', f: false },
        { text: 'Bereit für den Tag', f: true }
    ];
    const mittag = [
        { text: 'Guten Mittag', f: false },
        { text: 'Und wie läuft der Tag', f: true }
    ]
    const nachmittag = [
        { text: 'Guten Nachmittag', f: false },
        { text: 'Na, wie läuft dein Tag', f: true }
    ]
    const abend = [
        { text: 'Guten Abend', f: false },
        { text: 'Alles entspannt bei dir', f: true },
        { text: 'Lass den Tag gut ausklingen', f: false }
    ]
    const nacht = [
        { text: 'Gute Nacht', f: false },
        { text: 'Schon müde', f: true }
    ]
    let text = '';

    if (stunde >= 5 && stunde < 11) {
        const zufall = morgen[Math.floor(Math.random() * morgen.length)];
        text = zufall.text;
        if (f) f.innerText = zufall.f ? '?' : '';
    } else if (stunde >= 11 && stunde < 14) {
        const zufall = mittag[Math.floor(Math.random() * morgen.length)];
        text = zufall.text;
        if (f) f.innerText = zufall.f ? '?' : '';
    } else if (stunde >= 14 && stunde < 17) {
        const zufall = nachmittag[Math.floor(Math.random() * morgen.length)];
        text = zufall.text;
        if (f) f.innerText = zufall.f ? '?' : '';
    } else if (stunde >= 17 && stunde < 22) {
        const zufall = abend[Math.floor(Math.random() * morgen.length)];
        text = zufall.text;
        if (f) f.innerText = zufall.f ? '?' : '';
    } else {
        const zufall = nacht[Math.floor(Math.random() * morgen.length)];
        text = zufall.text;
        if (f) f.innerText = zufall.f ? '?' : '';
    }

    if (founduser.username == 'Nina13') {
        text = 'Hiiii meine kleine 😘'
        if (f) f.innerText = '';
    }
    if (begruessung) begruessung.innerText = text;
}

bgsetting.onmouseenter = function () {
    settingsframe.style.opacity = '0.4';
    dashboard.style.opacity = '0';
}

bgsetting.onmouseleave = function () {
    settingsframe.style.opacity = '1'
    dashboard.style.opacity = '1';
}

function changebg(color) {
    const body = document.body;

    localStorage.setItem('bg-color', color);
    nutzerdatenAendern(founduser.username, { bgcolor: color });

    // Alle verfügbaren Buttons und ihre zugehörigen Farben
    const buttons = [
        { id: 'blackbg', gradient: 'linear-gradient(-45deg, black, gray)' },
        { id: 'blackbg1', gradient: 'linear-gradient(-45deg, black, gray)' },
        { id: 'bluebg', gradient: 'linear-gradient(-45deg, blue, red)' },
        { id: 'bluebg1', gradient: 'linear-gradient(-45deg, blue, red)' },
        { id: 'greenbg', gradient: 'linear-gradient(-45deg, green, yellow)' },
        { id: 'greenbg1', gradient: 'linear-gradient(-45deg, green, yellow)' },
        { id: 'redbg', gradient: 'linear-gradient(-45deg, red, orange)' },
        { id: 'redbg1', gradient: 'linear-gradient(-45deg, red, orange)' },
        { id: 'lilabg', gradient: 'linear-gradient(-45deg, purple, blue)' },
        { id: 'lilabg1', gradient: 'linear-gradient(-45deg, purple, blue)' },
        { id: 'bluegreenbg', gradient: 'linear-gradient(-45deg, blue, green)' },
        { id: 'bluegreenbg1', gradient: 'linear-gradient(-45deg, blue, green)' },
        { id: 'greenredbg', gradient: 'linear-gradient(-45deg, green, red)' },
        { id: 'greenredbg1', gradient: 'linear-gradient(-45deg, green, red)' },
        { id: 'spinningbg', gradient: 'linear-gradient(-45deg, green, red)' },
        { id: 'spinningbg1', gradient: 'linear-gradient(-45deg, green, red)' },
        { id: 'wavebg', gradient: 'linear-gradient(-45deg, green, red)' },
        { id: 'wavebg1', gradient: 'linear-gradient(-45deg, green, red)' },
        { id: 'rainbg', gradient: 'linear-gradient(-45deg, green, red)' },
        { id: 'rainbg1', gradient: 'linear-gradient(-45deg, green, red)' },
        { id: 'slidebg', gradient: 'linear-gradient(-45deg, green, red)' },
        { id: 'slidebg1', gradient: 'linear-gradient(-45deg, green, red)' },
    ];

    // Hilfsfunktion für das Umschalten der Button-Auswahl
    function updateButtonSelection(selectedColor) {
        buttons.forEach((button) => {
            const element = document.getElementById(button.id);
            if (!element) return;
    
            if (button.id.startsWith(selectedColor)) {
                element.classList.add('selected');
                element.classList.remove('notselected');
            } else {
                element.classList.remove('selected');
                element.classList.add('notselected');
            }
        });
    }
    

    // Hilfsfunktion für das Black-Overlay und das Laden des Iframes
    function handleSpecialBg(bgName, scale, src) {
        black.style.display = 'block';
        black.style.opacity = '0';
        black.style.transition = 'opacity 1s';
        black.style.zIndex = -10;
        void black.offsetWidth;
        black.style.opacity = '1';
        updateButtonSelection(bgName + 'bg');
        bgiframe.addEventListener('load', function handler() {
            bgiframe.removeEventListener('load', handler);
            setTimeout(() => {
                bgiframe.style.display = 'block';
                bgiframe.style.transition = 'opacity 1s, filter 2s';
                bgiframe.style.opacity = '1';
                bgiframe.style.transform = scale;
                black.style.transition = 'opacity 1s';
                black.style.opacity = '0';
                black.addEventListener('transitionend', function handler2() {
                    black.style.display = 'none';
                    black.removeEventListener('transitionend', handler2);
                });
            }, 500);
        });
        setTimeout(() => {
            bgiframe.setAttribute('src', src);
        }, 1000);
    }

    if (color === 'spinning') {
        handleSpecialBg('spinning', 'scale(5)', 'LoadingScreen/Spinning Circle/index.html');
        return;
    } else if (color === 'wave') {
        handleSpecialBg('wave', 'scale(1)', 'LoadingScreen/Wave/index.html');
        return;
    } else if (color === 'rain') {
        handleSpecialBg('rain', 'scale(1)', 'LoadingScreen/Rain/index.html');
        return;
    } else if (color === 'slide') {
        handleSpecialBg('slide', 'scale(1)', 'LoadingScreen/Sliding Diagonals/index.html');
        return;
    }

    // Für normale Farbverläufe
    const selectedButton = buttons.find((button) => button.id.includes(color));

    if (selectedButton) {
        // Korrigierte Bedingung: Nur wenn NICHT einer der Spezialtypen, dann iframe ausblenden
        if (!['spinning', 'wave', 'rain', 'slide'].includes(color)) {
            bgiframe.style.opacity = '0';
            bgiframe.setAttribute('src', ' ');
        }
        black.style.display = 'block';
        black.style.opacity = '0';
        black.style.transition = 'opacity 1s';
        void black.offsetWidth;
        black.style.opacity = '1';
        updateButtonSelection(selectedButton.id);
        setTimeout(() => {
            body.style.background = selectedButton.gradient;
            body.style.animation = 'none';
            body.style.backgroundSize = 'cover';
            black.style.transition = 'opacity 1s';
            black.style.opacity = '0';
            black.addEventListener('transitionend', function handler() {
                black.style.display = 'none';
                black.removeEventListener('transitionend', handler);
            });
        }, 300);
        localStorage.setItem('bg-color', color);
    }
}


function start() {
    intro.style.transition = 'opacity 1s'
    intro.style.opacity = '0'
    setTimeout(() => {
        intro.remove()
    }, 1000);
    setTimeout(() => {
        // Warten bis die Nutzer aus Supabase geladen sind
        if (users.length === 0) {
            console.log('Warte auf Supabase-Nutzer...');
            setTimeout(() => start(), 500);
            return;
        }

        // Nutzer aus localStorage finden
        if (localStorage.getItem('username')) {
            users.forEach(function (user) {
                if (user.username === localStorage.getItem('username')) {
                    founduser = user;
                }
            });
        }

        window.founduser = founduser
        //Admin Funktionen
        if (founduser && founduser.username && founduser.username == 'Paluss1122') {
            //Überschrift
            let headerlink = document.createElement('h3')
            headerlink.innerHTML = '<u>Admin</u>';
            linkcontainer.appendChild(headerlink);
            //Analytics
            let newlink1 = document.createElement('a');
            newlink1.setAttribute('href', 'Admin/analytics.html');
            newlink1.innerHTML = '<span>Analytics</span>'
            linkcontainer.appendChild(newlink1);
            //Nutzer Verwaltung
            let newlink2 = document.createElement('a');
            newlink2.setAttribute('href', 'Admin/user-management.html');
            newlink2.innerHTML = '<span>Nutzer Verwaltung</span>'
            linkcontainer.appendChild(newlink2);
            //Einstellungen
            let newlink3 = document.createElement('a');
            newlink3.setAttribute('href', 'Admin/settings.html');
            newlink3.innerHTML = '<span>Einstellungen</span>'
            linkcontainer.appendChild(newlink3);
        }

        if (localStorage.getItem('allowedcookies') && !founduser.allowedcookies) {
            window.nutzerdatenAendern(founduser.username, { 'allowedcookies': localStorage.getItem('allowedcookies') })
        }

        // Mobile Anpassung
        if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            if (loginContainer) {
                loginContainer.style.width = '80%';
            }
        }

        // bg-color aus Supabase in localStorage synchronisieren
        if (founduser && founduser.bgcolor && !localStorage.getItem('bg-color')) {
            localStorage.setItem('bg-color', founduser.bgcolor);
        }
        // displayname aus Supabase in localStorage synchronisieren
        if (founduser && founduser.displayname && !localStorage.getItem('displayname')) {
            localStorage.setItem('displayname', founduser.displayname);
        }

        // allowedcookies aus Supabase in localStorage synchronisieren
        if (founduser && founduser.allowedcookies && !localStorage.getItem('allowedcookies')) {
            localStorage.setItem('allowedcookies', 'true');
        }

        // bg-color aus localStorage in Supabase synchronisieren (falls nicht vorhanden)
        if (localStorage.getItem('bg-color') && founduser && !founduser.bgcolor) {
            nutzerdatenAendern(founduser.username, { bgcolor: localStorage.getItem('bg-color') });
        }

        // Vollständig eingeloggt - Dashboard anzeigen
        if (localStorage.getItem('username') &&
            localStorage.getItem('password') &&
            localStorage.getItem('bg-color') &&
            localStorage.getItem('displayname') &&
            localStorage.getItem('allowedcookies')
        ) {
            // Dashboard direkt anzeigen
            startp.style.display = 'none';
            if (loginContainer) {
                loginContainer.remove();
            }
            dashboard.style.display = 'block';
            setTimeout(() => {
                dashboard.style.opacity = '1';
            }, 100);
            bgiframe.style.transition = 'filter 2s';
            bgiframe.style.filter = 'saturate(1)';
            localStorage.setItem('showeddb', 'true');

            getTageszeit()
            // usname aus founduser.displayname setzen
            if (founduser && founduser.displayname) {
                usname.innerText = founduser.displayname;
            }

            changebg(founduser.bgcolor)

            document.getElementsByClassName('settings')[0].style.display = 'block';
            return;
        }

        // Nur Username vorhanden - Passwort eingeben
        if (localStorage.getItem('username') &&
            !localStorage.getItem('password')
        ) {
            startp.innerText = 'Lass uns weitermachen!';
            setTimeout(() => {
                startp.style.opacity = '1';
            }, 10);
            setTimeout(() => {
                startp.style.transition = 'opacity 1s';
                startp.style.opacity = '0';
                loginContainer.style.display = 'block';
                loginform2.style.display = 'block';
                loginform1.style.display = 'none';
                loginContainer.style.transition = 'opacity 1s';
                setTimeout(() => {
                    loginContainer.style.opacity = '1';
                }, 100);
                bgiframe.style.filter = 'saturate(1)';
                setTimeout(() => {
                    startp.style.display = 'none';
                }, 1000);
            }, 3000);
            return;
        }

        // Username und Passwort vorhanden, aber kein bg-color
        if (localStorage.getItem('username') &&
            localStorage.getItem('password') &&
            !localStorage.getItem('bg-color')
        ) {
            startp.innerText = 'Lass uns mit der Anmeldung fortfahren!';
            setTimeout(() => {
                startp.style.opacity = '1';
            }, 10);
            setTimeout(() => {
                startp.style.transition = 'opacity 1s';
                startp.style.opacity = '0';
                loginContainer.style.display = 'block';
                loginform1.style.display = 'none';
                loginform2.style.display = 'none';
                loginform3.style.display = 'block';
                loginContainer.style.transition = 'opacity 1s';
                setTimeout(() => {
                    loginContainer.style.opacity = '1';
                }, 100);
                bgiframe.style.filter = 'saturate(1)';
                setTimeout(() => {
                    startp.style.display = 'none';
                }, 1000);
            }, 3000);
            return;
        }

        // Username, Passwort und bg-color vorhanden, aber kein displayname
        if (localStorage.getItem('username') &&
            localStorage.getItem('password') &&
            localStorage.getItem('bg-color') &&
            !localStorage.getItem('displayname')
        ) {
            startp.innerText = 'Lass uns mit deinem personalisierten Namen weitermachen!';
            setTimeout(() => {
                startp.style.opacity = '1';
            }, 10);
            setTimeout(() => {
                startp.style.transition = 'opacity 1s';
                startp.style.opacity = '0';
                loginContainer.style.display = 'block';
                loginform1.style.display = 'none';
                loginform2.style.display = 'none';
                loginform3.style.display = 'none';
                loginform4.style.display = 'block';
                loginContainer.style.transition = 'opacity 1s';
                setTimeout(() => {
                    loginContainer.style.opacity = '1';
                }, 100);
                bgiframe.style.filter = 'saturate(1)';
                setTimeout(() => {
                    startp.style.display = 'none';
                }, 1000);
            }, 3000);
            changebg(founduser.bgcolor)
            return;
        }

        // Username, Passwort, bg-color und displayname vorhanden, aber kein allowedcookies
        if (localStorage.getItem('username') &&
            localStorage.getItem('password') &&
            localStorage.getItem('bg-color') &&
            localStorage.getItem('displayname') &&
            !localStorage.getItem('allowedcookies')
        ) {
            startp.innerText = 'Fahren wir fort!';
            setTimeout(() => {
                startp.style.opacity = '1';
            }, 10);
            setTimeout(() => {
                startp.style.transition = 'opacity 1s';
                startp.style.opacity = '0';
                loginContainer.style.display = 'block';
                loginform1.style.display = 'none';
                loginform2.style.display = 'none';
                loginform3.style.display = 'none';
                loginform4.style.display = 'none';
                loginform5.style.display = 'block';
                loginContainer.style.transition = 'opacity 1s';
                setTimeout(() => {
                    loginContainer.style.opacity = '1';
                }, 100);
                bgiframe.style.filter = 'saturate(1)';
                setTimeout(() => {
                    startp.style.display = 'none';
                }, 1000);
            }, 3000);
            changebg(founduser.bgcolor)
            return;
        }

        // Kein Login-Status vorhanden - alles zurücksetzen
        localStorage.clear();
        setTimeout(() => {
            startp.style.opacity = '1';
        }, 10);
        setTimeout(() => {
            startp.style.transition = 'opacity 1s';
            startp.style.opacity = '0';
            loginContainer.style.display = 'block';
            loginContainer.style.transition = 'opacity 1s';
            setTimeout(() => {
                loginContainer.style.opacity = '1';
            }, 100);
            bgiframe.style.filter = 'saturate(1)';
            setTimeout(() => {
                startp.style.display = 'none';
            }, 1000);
        }, 3000);
    }, 1000);
}

function info(title, text) {
    infocontainer.style.zIndex = '100';
    infocontainer.style.opacity = '1';
    infotitle.innerText = title;
    infotext.innerHTML = text;
}

function nousername() {
    info('Keinen Nutzername erhalten / vergessen', 'Stelle sicher, dass du Kunde bist!<br> Wenn ja, frage mich bitte nochmal nach deinem Nutzername, den ich dir dann gerne schicke!');
}

function nopassword() {
    info('Kein Passwort erhalten / vergessen', 'Stelle sicher, dass du Kunde bist!<br> Wenn ja, frage mich bitte nochmal nach deinem Passwort, welches ich dir dann gerne schicke!');
}

loginform1.onsubmit = function (event) {
    event.preventDefault();
    const usernameInput = username.value.trim();

    // Prüfen ob Nutzer aus Supabase geladen sind
    if (users.length === 0) {
        Hinweis1.style.display = 'block';
        Hinweis1.innerText = 'Fehler beim Laden der Nutzerdaten. Bitte versuche es erneut.';
        return;
    }

    users.forEach(function (user) {
        if (user.username === usernameInput) {
            founduser = user;
        }
    });
    if (founduser !== null) {
        bgiframe.style.filter = 'saturate(0)'
        loginContainer.style.transition = 'opacity 0.5s'
        loginContainer.style.opacity = '0';
        setTimeout(() => {
            this.style.display = 'none';
            startp.style.display = 'block';
            startp.innerText = 'Lass uns mit der Anmeldung fortfahren!';
            setTimeout(() => {
                startp.style.opacity = '1';
            }, 10);
            setTimeout(() => {
                startp.style.transition = 'opacity 1s';
                startp.style.opacity = '0';
                loginContainer.style.display = 'block';
                loginform1.style.display = 'none';
                loginform2.style.display = 'block';
                loginform3.style.display = 'none';
                loginContainer.style.transition = 'opacity 1s';
                setTimeout(() => {
                    loginContainer.style.opacity = '1';
                }, 100);
                bgiframe.style.filter = 'saturate(1)';
                setTimeout(() => {
                    startp.style.display = 'none';
                }, 1000);
            }, 3000);
        }, 500);
        localStorage.setItem('username', founduser.username)
    } else {
        Hinweis1.style.display = 'block';
        Hinweis1.innerText = 'Nutzername nicht korrekt. Überprüfe die Schreibweise!';
    }
};

// Passwort 'absenden' Button
loginform2.onsubmit = function (event) {
    event.preventDefault();

    // Prüfen ob Nutzer aus Supabase geladen sind
    if (users.length === 0) {
        Hinweis2.style.display = 'block';
        Hinweis2.innerText = 'Fehler beim Laden der Nutzerdaten. Bitte warte einen Moment.';
        setTimeout(() => {
            window.location.reload()
        }, 1000);
        return
    }

    if (founduser && founduser.password == password.value) {
        bgiframe.style.filter = 'saturate(0)'
        loginContainer.style.transition = 'opacity 0.5s'
        loginContainer.style.opacity = '0';
        setTimeout(() => {
            if (!founduser.bgcolor && !localStorage.getItem('bg-color')) {
                bgiframe.style.transition = 'filter 2s'
                bgiframe.style.filter = 'saturate(0)'
                startp.style.display = 'block';
                startp.innerText = 'Lass uns mit der Personalisierung weitermachen!';
                setTimeout(() => {
                    startp.style.opacity = '1';
                }, 10);
                setTimeout(() => {
                    startp.style.transition = 'opacity 1s';
                    startp.style.opacity = '0';
                    loginContainer.style.display = 'block';
                    loginform1.style.display = 'none';
                    loginform2.style.display = 'none';
                    loginform3.style.display = 'block';
                    loginform4.style.display = 'none';
                    loginContainer.style.transition = 'opacity 1s';
                    setTimeout(() => {
                        loginContainer.style.opacity = '1';
                    }, 100);
                    bgiframe.style.filter = 'saturate(1)';
                    setTimeout(() => {
                        startp.style.display = 'none';
                    }, 1000);
                }, 3000);
            } else if (founduser.bgcolor && !founduser.displayname && !founduser.allowedcookies) {
                bgiframe.style.transition = 'filter 2s'
                bgiframe.style.filter = 'saturate(0)'
                startp.style.display = 'block';
                startp.innerText = 'Lass uns mit deinem personalisierten Namen weitermachen!';
                setTimeout(() => {
                    startp.style.opacity = '1';
                }, 10);
                setTimeout(() => {
                    startp.style.transition = 'opacity 1s';
                    startp.style.opacity = '0';
                    loginContainer.style.display = 'block';
                    loginform1.style.display = 'none';
                    loginform2.style.display = 'none';
                    loginform3.style.display = 'none';
                    loginform4.style.display = 'block';
                    loginContainer.style.transition = 'opacity 1s';
                    setTimeout(() => {
                        loginContainer.style.opacity = '1';
                    }, 100);
                    bgiframe.style.filter = 'saturate(1)';
                    setTimeout(() => {
                        startp.style.display = 'none';
                    }, 1000);
                }, 3000);
            } else if (founduser.bgcolor && founduser.displayname && !founduser.allowedcookies) {
                bgiframe.style.transition = 'filter 2s'
                bgiframe.style.filter = 'saturate(0)'
                startp.style.display = 'block';
                startp.innerText = 'Fahren wir fort!';
                setTimeout(() => {
                    startp.style.opacity = '1';
                }, 10);
                setTimeout(() => {
                    startp.style.transition = 'opacity 1s';
                    startp.style.opacity = '0';
                    loginContainer.style.display = 'block';
                    loginform1.style.display = 'none';
                    loginform2.style.display = 'none';
                    loginform4.style.display = 'none';
                    loginform3.style.display = 'none';
                    loginform5.style.display = 'block';
                    loginContainer.style.transition = 'opacity 1s';
                    setTimeout(() => {
                        loginContainer.style.opacity = '1';
                    }, 100);
                    bgiframe.style.filter = 'saturate(1)';
                    setTimeout(() => {
                        startp.style.display = 'none';
                    }, 1000);
                }, 3000);
            } else if (founduser.bgcolor && founduser.displayname && founduser.allowedcookies) {
                bgiframe.style.transition = 'filter 2s'
                bgiframe.style.filter = 'saturate(0)'
                startp.style.display = 'block';
                startp.innerText = 'Du bist nun bereit!';
                setTimeout(() => {
                    startp.style.opacity = '1';
                }, 10);
                setTimeout(() => {
                    startp.style.transition = 'opacity 1s';
                    startp.style.opacity = '0';
                    loginContainer.style.display = 'none';
                    dashboard.style.display = 'block';
                    loginform1.style.display = 'none';
                    loginform2.style.display = 'none';
                    loginform3.style.display = 'none';
                    loginform4.style.display = 'none';
                    loginform5.style.display = 'none';
                    setTimeout(() => {
                        dashboard.style.opacity = '1'
                    }, 100);
                    bgiframe.style.transition = 'filter 2s'
                    bgiframe.style.filter = 'saturate(1)';
                    setTimeout(() => {
                        startp.style.display = 'none';
                    }, 1000);
                    localStorage.setItem('showeddb', true)

                    // usname aus founduser.displayname setzen
                    if (founduser && founduser.displayname) {
                        usname.innerText = founduser.displayname;
                    }
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000);
                }, 3000);
            }
        }, 500);
        localStorage.setItem('password', founduser.password)
    } else {
        Hinweis2.style.display = 'block';
        Hinweis2.innerText = 'Passwort nicht korrekt. Überprüfe die Schreibweise!';
    }
};

loginform3.onsubmit = function (event) {
    event.preventDefault();
    loginContainer.style.transition = 'opacity 0.5s'
    loginContainer.style.opacity = '0';
    if (!localStorage.getItem('bg-color')) {
        changebg('spinning')
    }
    setTimeout(() => {
        if (!localStorage.getItem('displayname') && !founduser.displayname) {
            bgiframe.style.transition = 'filter 2s'
            bgiframe.style.filter = 'saturate(0)'
            startp.style.display = 'block';
            startp.innerText = 'Lass uns mit deinem personalisierten Namen weitermachen!';
            setTimeout(() => {
                startp.style.opacity = '1';
            }, 10);
            setTimeout(() => {
                startp.style.transition = 'opacity 1s';
                startp.style.opacity = '0';
                loginContainer.style.display = 'block';
                loginform1.style.display = 'none';
                loginform2.style.display = 'none';
                loginform3.style.display = 'none';
                loginform4.style.display = 'block';
                loginContainer.style.transition = 'opacity 1s';
                setTimeout(() => {
                    loginContainer.style.opacity = '1';
                }, 100);
                bgiframe.style.filter = 'saturate(1)';
                setTimeout(() => {
                    startp.style.display = 'none';
                }, 1000);
            }, 3000);
        } else if (localStorage.getItem('displayname') && !localStorage.getItem('allowedcookies') && !founduser.allowedcookies || founduser.displayname && !localStorage.getItem('allowedcookies') && !founduser.allowedcookies) {
            bgiframe.style.transition = 'filter 2s'
            bgiframe.style.filter = 'saturate(0)'
            startp.style.display = 'block';
            startp.innerText = 'Fahren wir fort!';
            setTimeout(() => {
                startp.style.opacity = '1';
            }, 10);
            setTimeout(() => {
                startp.style.transition = 'opacity 1s';
                startp.style.opacity = '0';
                loginContainer.style.display = 'block';
                loginform1.style.display = 'none';
                loginform2.style.display = 'none';
                loginform4.style.display = 'none';
                loginform3.style.display = 'none';
                loginform5.style.display = 'block';
                loginContainer.style.transition = 'opacity 1s';
                setTimeout(() => {
                    loginContainer.style.opacity = '1';
                }, 100);
                bgiframe.style.filter = 'saturate(1)';
                setTimeout(() => {
                    startp.style.display = 'none';
                }, 1000);
            }, 3000);
            localStorage.setItem('displayname', founduser.displayname)

        } else if (localStorage.getItem('allowedcookies') || founduser.allowedcookies) {
            bgiframe.style.transition = 'filter 2s'
            bgiframe.style.filter = 'saturate(0)'
            startp.style.display = 'block';
            startp.innerText = 'Du bist nun bereit!';
            setTimeout(() => {
                startp.style.opacity = '1';
            }, 10);
            setTimeout(() => {
                startp.style.transition = 'opacity 1s';
                startp.style.opacity = '0';
                loginContainer.style.display = 'none';
                dashboard.style.display = 'block';
                loginform1.style.display = 'none';
                loginform2.style.display = 'none';
                loginform3.style.display = 'none';
                loginform4.style.display = 'none';
                loginform5.style.display = 'none';
                setTimeout(() => {
                    dashboard.style.opacity = '1'
                }, 100);
                bgiframe.style.transition = 'filter 2s'
                bgiframe.style.filter = 'saturate(1)';
                setTimeout(() => {
                    startp.style.display = 'none';
                }, 1000);
                localStorage.setItem('showeddb', true)
                window.location.reload()

                // usname aus founduser.displayname setzen
                if (founduser && founduser.displayname) {
                    usname.innerText = founduser.displayname;
                }
            }, 3000);
            localStorage.setItem('allowedcookies', true)
        }
    }, 500);
};

loginform4.onsubmit = function (event) {
    event.preventDefault();
    loginContainer.style.transition = 'opacity 0.5s'
    loginContainer.style.opacity = '0';
    setTimeout(() => {
        bgiframe.style.transition = 'filter 2s'
        bgiframe.style.filter = 'saturate(0)'
        startp.style.display = 'block';
        startp.innerText = 'Fahren wir fort!';
        setTimeout(() => {
            startp.style.opacity = '1';
        }, 10);
        setTimeout(() => {
            startp.style.transition = 'opacity 1s';
            startp.style.opacity = '0';
            loginContainer.style.display = 'block';
            loginform1.style.display = 'none';
            loginform2.style.display = 'none';
            loginform4.style.display = 'none';
            loginform5.style.display = 'block';
            loginContainer.style.transition = 'opacity 1s';
            setTimeout(() => {
                loginContainer.style.opacity = '1';
            }, 100);
            bgiframe.style.filter = 'saturate(1)';
            setTimeout(() => {
                startp.style.display = 'none';
            }, 1000);
        }, 3000);
    }, 500);
    localStorage.setItem('displayname', displayname.value)
    nutzerdatenAendern(founduser.username, { displayname: displayname.value })
};

loginform5.onsubmit = function (event) {
    event.preventDefault();
    if (localStorage.getItem('displayname')) {
        usname.innerText = founduser.displayname
    }
    localStorage.setItem('allowedcookies', true);
    nutzerdatenAendern(founduser.username, { allowedcookies: true })
    loginContainer.style.transition = 'opacity 0.5s'
    loginContainer.style.opacity = '0';
    setTimeout(() => {
        bgiframe.style.transition = 'filter 2s'
        bgiframe.style.filter = 'saturate(0)'
        startp.style.display = 'block';
        startp.innerText = 'Du bist nun bereit!';
        setTimeout(() => {
            startp.style.opacity = '1';
        }, 10);
        setTimeout(() => {
            startp.style.transition = 'opacity 1s';
            startp.style.opacity = '0';
            loginContainer.style.display = 'none';
            dashboard.style.display = 'block';
            loginform1.style.display = 'none';
            loginform2.style.display = 'none';
            loginform3.style.display = 'none';
            loginform4.style.display = 'none';
            loginform5.style.display = 'none';
            setTimeout(() => {
                dashboard.style.opacity = '1'
            }, 100);
            bgiframe.style.transition = 'filter 2s'
            bgiframe.style.filter = 'saturate(1)';
            setTimeout(() => {
                startp.style.display = 'none';
            }, 1000);
            localStorage.setItem('showeddb', true)

            // usname aus founduser.displayname setzen
            if (founduser && founduser.displayname) {
                usname.innerText = founduser.displayname;
            }
        }, 3000);
    }, 500);
    window.location.reload()
};

setdisplayname.onsubmit = function (e) {
    e.preventDefault();
    nutzerdatenAendern(founduser.username, { displayname: setdisplayname.value });
    Hinweis3.innerText = 'Name erfolgreich geändert!'
}