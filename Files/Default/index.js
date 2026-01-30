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

function reporterror(msg) {
    if (window.reporterror) {
        window.reporterror(msg);
    } else {
        console.error('reporterror:', msg);
    }
}

function SendAnalyticsStep(step) {
    if (window.SendAnalyticsStep) {
        window.SendAnalyticsStep(step);
    } else {
        console.log('Analytics Step:', step);
    }
}

function warteAufBubbleButton(versuche = 0) {
    const bubblebt = document.getElementById('chatbase-bubble-button');
    if (bubblebt) {
        if (!localStorage.getItem("username")) {
            bubblebt.style.display = "none"
        }
        bubblebt.style.zIndex = '0';
        bubblebt.onclick = function () {
            SendAnalyticsStep('Chatbot geöffnet')
        }
    } else if (versuche < 20) { // Maximal 20 Versuche (ca. 10 Sekunden)
        setTimeout(() => {
            warteAufBubbleButton(versuche + 1);
        }, 500);
    }
}
function warteAufBubbleMessage(versuche = 0) {
    // Deutsche Version mit Fix: Die Wiederholungen werden jetzt nur einmal gesetzt, und beide Elemente werden unabhängig geprüft.
    const closeBtn = Array.from(document.querySelectorAll('div')).find(el => el.textContent.trim() === '✕' && el.style.position === 'absolute');
    const msgbubble = document.querySelector('div[style*="display: flex"][style*="justify-content: flex-end"]');

    if (closeBtn && msgbubble) {
        closeBtn.onclick = function () {
            SendAnalyticsStep('Chatbase Pop Message geschlossen');
        }
        msgbubble.style.zIndex = '0';
        msgbubble.style.position = 'relative';
    } else if (versuche < 20) {
        setTimeout(() => {
            warteAufBubbleMessage(versuche + 1);
        }, 500);
    }

    if (msgbubble) {
        msgbubble.addEventListener('click', function () {
            SendAnalyticsStep('Auf Chatbase Pop Message gedrückt');
        });
    }
}
setTimeout(() => {
    warteAufBubbleMessage();
    warteAufBubbleButton();
}, 1000);

// Tutorial Variablen
const tutorialOverlay = document.getElementById('tutorial-overlay');
const tutorialTitle = document.getElementById('tutorial-title');
const tutorialText = document.getElementById('tutorial-text');
const tutorialHighlight = document.getElementById('tutorial-highlight');
const tutorialPrev = document.getElementById('tutorial-prev');
const tutorialNext = document.getElementById('tutorial-next');
const tutorialSkip = document.getElementById('tutorial-skip');
const tutorialcontent = document.getElementById('tutorial-content')

let tutorialStep = 0;
const tutorialSteps = [
    {
        title: 'Willkommen beim Dashboard!',
        text: 'Lass mich dir zeigen, wie du die wichtigsten Funktionen nutzen kannst.',
        highlight: null
    },
    {
        title: 'Navigation zu den Einstellungen ⚙️',
        text: 'Hier findest du die Einstellungen. Klicke auf das Zahnrad-Symbol unten links, um deine persönlichen Einstellungen zu ändern.',
        highlight: 'shopbt'
    },
    {
        title: 'Hintergrund anpassen 🎨',
        text: 'In den Einstellungen kannst du deinen Hintergrund ändern. Wähle zwischen verschiedenen Animationen und Farbverläufen.',
        highlight: 'bg-setting'
    },
    {
        title: 'Nutzername ändern 👤',
        text: 'Du kannst auch deinen Anzeigenamen in den Einstellungen ändern, falls du das möchtest.',
        highlight: null
    },
    {
        title: 'Dashboard erkunden 🚀',
        text: 'Hier findest du alle wichtigen Links und Funktionen. Du kannst jederzeit zu den Einstellungen zurückkehren.',
        highlight: 'dashboard'
    },
    {
        title: 'Hausaufgaben Organizieren',
        text: 'Hier kannst du deine Hausaufgaben speichern',
        highlight: 'he'
    },
    {
        title: 'Kalender',
        text: 'Hier findest du alle Events des IKGs',
        highlight: 'ca'
    },
    {
        title: 'Tutorial abgeschlossen! ✅',
        text: 'Perfekt! Du weißt jetzt, wie du zu den Einstellungen gelangst. Viel Spaß beim Erkunden deines Dashboards!',
        highlight: null
    }
];

// Tutorial Funktionen
function startTutorial() {
    if (localStorage.getItem('tutorial-completed')) {
        return; // Tutorial bereits abgeschlossen
    }

    tutorialStep = 0;
    tutorialOverlay.style.display = 'block';
    tutorialcontent.style.display = 'block';
    setTimeout(() => {
        tutorialOverlay.style.transition = 'opacity 1s';
        tutorialOverlay.style.opacity = '1';
        tutorialcontent.style.transition = 'opacity 1s';
        tutorialcontent.style.opacity = '1';
    }, 10);
    updateTutorialStep();
}

function updateTutorialStep() {
    const step = tutorialSteps[tutorialStep];
    tutorialTitle.textContent = step.title;
    tutorialText.textContent = step.text;

    // Alle vorherigen z-index-Werte zurücksetzen
    tutorialSteps.forEach((prevStep, index) => {
        if (prevStep.highlight && index !== tutorialStep) {
            const prevElement = document.getElementById(prevStep.highlight);
            if (prevElement) {
                prevElement.style.zIndex = 'auto';
            }
        }
    });

    if (tutorialStep == 4) {
        settings();
    }

    // Tutorial-Overlay zurücksetzen (falls von Step 2)
    if (tutorialStep !== 2 && tutorialStep !== 3 && tutorialStep !== 4 && tutorialStep !== 5 && tutorialStep !== 6) {
        tutorialOverlay.style.background = 'rgba(0,0,0,0.8)';
        tutorialOverlay.style.zIndex = '999999';
        const tutorialContent = document.getElementById('tutorial-content');
        if (tutorialContent) {
            tutorialContent.style.top = '50%';
            tutorialContent.style.bottom = 'unset';
            tutorialContent.style.transform = 'translate(-50%, -50%)';
        }
    } else if (tutorialStep == 4 || tutorialStep == 5 || tutorialStep == 6) {
        tutorialOverlay.style.background = 'rgba(0,0,0,0.8)';
        tutorialOverlay.style.zIndex = '999999';
        const tutorialContent = document.getElementById('tutorial-content');
        if (tutorialContent) {
            tutorialContent.style.top = 'unset';
            tutorialContent.style.bottom = '0';
            tutorialContent.style.transform = 'translate(-50%, 0)';
        }
    }

    // Highlight-Element zurücksetzen
    tutorialHighlight.style.display = 'none';
    tutorialHighlight.style.width = '0px';
    tutorialHighlight.style.height = '0px';
    tutorialHighlight.style.left = '0px';
    tutorialHighlight.style.bottom = '0px';

    // Element hervorheben, falls vorhanden
    if (step.highlight) {
        const element = document.getElementById(step.highlight);
        if (element) {
            const rect = element.getBoundingClientRect();
            if (tutorialStep !== 2 && tutorialStep !== 3) {
                tutorialHighlight.style.display = 'block';
                tutorialHighlight.style.position = 'fixed';
                tutorialHighlight.style.width = element.offsetWidth + 'px';
                tutorialHighlight.style.height = element.offsetHeight - 5 + 'px';
                tutorialHighlight.style.left = rect.left + 'px';
                tutorialHighlight.style.top = rect.top + 'px'; // WICHTIG: `top`, nicht `bottom`
                element.style.zIndex = '1000000';
                if (tutorialStep == 4) {
                    tutorialHighlight.style.background = 'none'
                }
            } else {
                // Bei Step 2: Tutorial-Overlay transparent machen und Element zugänglich halten
                tutorialHighlight.style.display = 'none';
                tutorialOverlay.style.background = 'rgba(0,0,0,0.3)'; // Transparenter Overlay
                tutorialOverlay.style.zIndex = '0';
                element.style.zIndex = '1000000000000'; // Hoher z-index für Interaktion

                // Tutorial-Content nach unten verschieben
                const tutorialContent = document.getElementById('tutorial-content');
                if (tutorialContent) {
                    tutorialContent.style.top = 'unset';
                    tutorialContent.style.bottom = '0';
                    tutorialContent.style.transform = 'translate(-50%, 0)';
                }
            }
            if (tutorialStep == 4) {
                const tutorialContent = document.getElementById('tutorial-content');
                tutorialContent.style.zIndex = "10000000"
            }
        }
    }

    if (tutorialStep == 1) {
        tutorialNext.style.display = 'none';
        document.getElementById(step.highlight).addEventListener('click', function () {
            stutorialNext()
            document.getElementById(step.highlight).style.zIndex = 'unset'
            tutorialcontent.style.top = 'unset';
            tutorialcontent.style.bottom = '0';
        })
    } else {
        tutorialNext.style.display = 'block';
    }

    // Button-Status aktualisieren
    tutorialPrev.style.display = tutorialStep === 0 ? 'none' : 'block';
    tutorialNext.textContent = tutorialStep === tutorialSteps.length - 1 ? 'Fertig' : 'Weiter';
}

function stutorialNext() {
    if (tutorialStep < tutorialSteps.length - 1) {
        tutorialStep++;
        updateTutorialStep();
    } else {
        stutorialSkip();
    }
}

function stutorialPrev() {
    if (tutorialStep > 0) {
        tutorialStep--;
        updateTutorialStep();
    }
}

function stutorialSkip() {
    // Alle z-index-Werte zurücksetzen
    tutorialSteps.forEach((step) => {
        if (step.highlight) {
            const element = document.getElementById(step.highlight);
            if (element) {
                element.style.zIndex = 'auto';
            }
        }
    });

    tutorialcontent.style.opacity = '0';
    tutorialOverlay.style.opacity = '0';
    tutorialHighlight.style.opacity = '0';

    setTimeout(() => {
        tutorialcontent.style.display = 'none';
        tutorialOverlay.style.display = 'none';
        tutorialHighlight.style.display = 'none';
    }, 1000);
    localStorage.setItem('tutorial-completed', 'true');
    SendAnalyticsStep('Tutorial abgeschlossen');
}

function resetTutorial() {
    localStorage.removeItem('tutorial-completed');
    SendAnalyticsStep('Tutorial zurückgesetzt und neu gestartet');
    startTutorial();
}

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
        SendAnalyticsStep('Guten Morgen Nachricht angezeigt: ' + text);
    } else if (stunde >= 11 && stunde < 14) {
        const zufall = mittag[Math.floor(Math.random() * morgen.length)];
        text = zufall.text;
        SendAnalyticsStep('Guten Mittag Nachricht angezeigt: ' + text);
        if (f) f.innerText = zufall.f ? '?' : '';
    } else if (stunde >= 14 && stunde < 17) {
        const zufall = nachmittag[Math.floor(Math.random() * morgen.length)];
        text = zufall.text;
        SendAnalyticsStep('Guten Nachmittag Nachricht angezeigt: ' + text);
        if (f) f.innerText = zufall.f ? '?' : '';
    } else if (stunde >= 17 && stunde < 22) {
        const zufall = abend[Math.floor(Math.random() * morgen.length)];
        text = zufall.text;
        if (f) f.innerText = zufall.f ? '?' : '';
        SendAnalyticsStep('Guten Abend Nachricht angezeigt: ' + text);
    } else {
        const zufall = nacht[Math.floor(Math.random() * morgen.length)];
        text = zufall.text;
        if (f) f.innerText = zufall.f ? '?' : '';
        SendAnalyticsStep('Gute Nacht Nachricht angezeigt: ' + text);
    }

    if (founduser.username == 'Nina13') {
        text = 'Hiiii meine kleine 😘'
        if (f) f.innerText = '';
        SendAnalyticsStep('Spezial Nachricht für Nini Mausi angezeigt: ' + text);
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

    function handleSpecialBg(bgName, scale, src) {
        black.style.display = 'block';
        black.style.opacity = '0';
        black.style.transition = 'opacity 1s';
        black.style.zIndex = -10;
        void black.offsetWidth;
        black.style.opacity = '1';
        updateButtonSelection(bgName + 'bg');

        // Event für Video laden
        function onLoaded() {
            bgiframe.removeEventListener('loadeddata', onLoaded);
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
        }
        bgiframe.addEventListener('loadeddata', onLoaded);

        setTimeout(() => {
            bgiframe.src = src;
            bgiframe.load && bgiframe.load();
        }, 1000);
    }

    if (color === 'spinning') {
        handleSpecialBg('spinning', 'scale(2)', 'LoadingScreen/Spinning circle/video.mp4');
        return;
    } else if (color === 'wave') {
        handleSpecialBg('wave', 'scale(1)', 'LoadingScreen/Wave/video.mp4');
        return;
    } else if (color === 'rain') {
        handleSpecialBg('rain', 'scale(1)', 'LoadingScreen/Rain/video.mp4');
        return;
    } else if (color === 'slide') {
        handleSpecialBg('slide', 'scale(1)', 'LoadingScreen/Sliding Diagonals/video.mp4');
        return;
    }

    // Für normale Farbverläufe
    const selectedButton = buttons.find((button) => button.id === color + 'bg' || button.id === color + 'bg1');

    if (selectedButton) {
        // Nur wenn NICHT einer der Spezialtypen, dann Video ausblenden
        if (color && ['spinning', 'wave', 'rain', 'slide'].includes(color)) {
            changebg(color);
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
        SendAnalyticsStep('Hintergrund geändert zu: ' + color);
    }
}


function start() {
    intro.style.transition = 'opacity 1s'
    intro.style.opacity = '0'
    update()
    setTimeout(() => {
        if (!generalData && window.generalData.length === 0) {
            setTimeout(() => start(), 500);
            return;
        }

        setTimeout(() => {
            intro.remove()
        }, 1000);

        if (localStorage.getItem('username')) {
            fetch(`/.netlify/functions/find-user?username=${encodeURIComponent(username)}`)
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('HTTP error! status: ' + response.status);
                    }
                    return response.json();
                })
                .then(function (result) {
                    if (result.user) {
                        founduser = result.user;
                        console.log('User gefunden:', founduser);
                        if (localStorage.getItem('password') && !localStorage.getItem('username')) {
                            if (!localStorage.getItem('errorhappened')) {
                                SendAnalyticsStep('Fehlerhafter Zustand: Passwort ohne Nutzername!');
                                alert('Es ist etwas Seltsames passiert! Bitte Lade die Seite neu!')
                                localStorage.setItem('errorhappened', true)
                                throw new Error('Annything strange Happened! Please refresh!')
                            } else {
                                SendAnalyticsStep('Fehlerhafter Zustand: Passwort ohne Nutzername, alles wird zurückgesetzt!');
                                localStorage.clear();
                                window.location.reload();
                            }
                        }

                        window.founduser = founduser
                        if (founduser && founduser.username && founduser.username == 'Plus1122') {
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
                            SendAnalyticsStep('Admin Funktionen hinzugefügt');
                        }

                        if (localStorage.getItem('allowedcookies') && founduser && !founduser.allowedcookies) {
                            window.nutzerdatenAendern(founduser.username, { 'allowedcookies': localStorage.getItem('allowedcookies') })
                            SendAnalyticsStep('allowedcookies aus localStorage in Supabase synchronisiert');
                        }

                        // Mobile Anpassung
                        if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                            if (loginContainer) {
                                loginContainer.style.width = '80%';
                                SendAnalyticsStep('Mobile erkannt, Login Container angepasst');
                            }
                        }

                        // bg-color aus Supabase in localStorage synchronisieren
                        if (founduser && founduser.bgcolor && !localStorage.getItem('bg-color')) {
                            localStorage.setItem('bg-color', founduser.bgcolor);
                            SendAnalyticsStep('bg-color aus Supabase in localStorage synchronisiert');
                        }
                        // displayname aus Supabase in localStorage synchronisieren
                        if (founduser && founduser.displayname && !localStorage.getItem('displayname')) {
                            localStorage.setItem('displayname', founduser.displayname);
                            SendAnalyticsStep('displayname aus Supabase in localStorage synchronisiert');
                        }

                        // allowedcookies aus Supabase in localStorage synchronisieren
                        if (founduser && founduser.allowedcookies && !localStorage.getItem('allowedcookies')) {
                            localStorage.setItem('allowedcookies', 'true');
                            SendAnalyticsStep('allowedcookies aus Supabase in localStorage synchronisiert');
                        }

                        // bg-color aus localStorage in Supabase synchronisieren (falls nicht vorhanden)
                        if (localStorage.getItem('bg-color') && founduser && !founduser.bgcolor) {
                            nutzerdatenAendern(founduser.username, { bgcolor: localStorage.getItem('bg-color') });
                            SendAnalyticsStep('bg-color aus localStorage in Supabase synchronisiert');
                        }

                        SendAnalyticsStep('SDB8 besucht!')

                        if (localStorage.getItem('username') &&
                            localStorage.getItem('password') &&
                            !localStorage.getItem('bg-color') &&
                            localStorage.getItem('displayname') &&
                            localStorage.getItem('allowedcookies')
                        ) {
                            startp.innerText = 'Oh es scheint, dass dein Hintergrund fehlt. Lass uns das beheben!';
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
                                loginform5.style.display = 'none';
                                loginContainer.style.transition = 'opacity 1s';
                                setTimeout(() => {
                                    loginContainer.style.opacity = '1';
                                }, 100);
                                bgiframe.style.filter = 'saturate(1)';
                                setTimeout(() => {
                                    startp.style.display = 'none';
                                }, 1000);
                            }, 3000);
                            changebg(founduser.bgcolor);
                            SendAnalyticsStep('Nutzer hat alle Daten bis auf bg color, bgcolor frame wird nun angezeigt');
                            return;
                        };

                        if (localStorage.getItem('username') &&
                            localStorage.getItem('password') &&
                            localStorage.getItem('bg-color') == 'null' &&
                            localStorage.getItem('displayname') &&
                            localStorage.getItem('allowedcookies')
                        ) {
                            startp.innerText = 'Oh es scheint, dass dein Hintergrund fehlt. Lass uns das beheben!';
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
                                loginform5.style.display = 'none';
                                loginContainer.style.transition = 'opacity 1s';
                                setTimeout(() => {
                                    loginContainer.style.opacity = '1';
                                }, 100);
                                bgiframe.style.filter = 'saturate(1)';
                                setTimeout(() => {
                                    startp.style.display = 'none';
                                }, 1000);
                            }, 3000);
                            changebg(founduser.bgcolor);
                            SendAnalyticsStep('Nutzer hat alle Daten bis auf bg color, bgcolor frame wird nun angezeigt');
                            return;
                        };

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

                            // Tutorial starten, falls noch nicht abgeschlossen
                            setTimeout(() => {
                                if (!localStorage.getItem('tutorial-completed') && window.released == true) {
                                    startTutorial();
                                    SendAnalyticsStep('Tutorial gestartet');
                                }
                            }, 1000);

                            if (window.released == false) {
                                document.getElementById('bg-iframe').setAttribute('src', '/');
                                SendAnalyticsStep('Noch nicht released also scource von bg iframe "/"');
                            }

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
                            SendAnalyticsStep('Nutzer hat nur username, passwort frame wird nun angezeigt');
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
                            SendAnalyticsStep('Nutzer hat nicht bg-color, bg-color frame wird nun angezeigt');
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
                            changebg(founduser.bgcolor);
                            SendAnalyticsStep('Nutzer hat nicht displayname, displayname frame wird nun angezeigt');
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
                            changebg(founduser.bgcolor);
                            SendAnalyticsStep('Nutzer hat alle Daten bis auf allowedcookies, cookies frame wird nun angezeigt');
                            return;
                        }

                        if (founduser && !founduser.bgcolor && founduser.displayname && founduser.allowedcookies
                        ) {
                            startp.innerText = 'Oh es scheint, dass dein Hintergrund fehlt. Lass uns das beheben!';
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
                                loginform5.style.display = 'none';
                                loginContainer.style.transition = 'opacity 1s';
                                setTimeout(() => {
                                    loginContainer.style.opacity = '1';
                                }, 100);
                                bgiframe.style.filter = 'saturate(1)';
                                setTimeout(() => {
                                    startp.style.display = 'none';
                                }, 1000);
                            }, 3000);
                            changebg(founduser.bgcolor);
                            SendAnalyticsStep('Nutzer hat alle Daten bis auf bg color, bgcolor frame wird nun angezeigt');
                            return;
                        };

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
                        SendAnalyticsStep('Kein Login-Status vorhanden, alles zurückgesetzt');
                    } else {
                        console.log('Kein User gefunden');
                    }
                })
                .catch(function (error) {
                    console.error('Fehler beim Abrufen des Users:', error);
                });
        }
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
    SendAnalyticsStep('Nutzer hat auf "Nutzername vergessen" gedrückt');
}

function nopassword() {
    info('Kein Passwort erhalten / vergessen', 'Stelle sicher, dass du Kunde bist!<br> Wenn ja, frage mich bitte nochmal nach deinem Passwort, welches ich dir dann gerne schicke!');
    SendAnalyticsStep('Nutzer hat auf "Passwort vergessen" gedrückt');
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
        window.SendAnalyticsStep('Nutzername eingegeben: ' + usernameInput);
    } else {
        Hinweis1.style.display = 'block';
        Hinweis1.innerText = 'Nutzername nicht korrekt. Überprüfe die Schreibweise!';
        window.SendAnalyticsStep('Fehlerhafter Nutzername: ' + usernameInput);
    }
};

// Passwort 'absenden' Button
loginform2.onsubmit = function (event) {
    event.preventDefault();

    // Prüfen ob Nutzer aus Supabase geladen sind
    if (users.length === 0) {
        Hinweis2.style.display = 'block';
        Hinweis2.innerText = 'Fehler beim Laden der Nutzerdaten. Bitte warte einen Moment.';
        reporterror('Keine Nutzer aus Supabase geladen beim Passwort eingeben!')
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

                    // Tutorial starten, falls noch nicht abgeschlossen

                    if (window.released == false) {
                        document.getElementById('bg-iframe').setAttribute('src', '/');
                        SendAnalyticsStep('Noch nicht released also scource von bg iframe "/"');
                    }

                    setTimeout(() => {
                        window.location.reload()
                    }, 2000);
                }, 3000);
            }
        }, 500);
        localStorage.setItem('password', founduser.password)
        window.SendAnalyticsStep('Passwort korrekt eingegeben');
    } else {
        Hinweis2.style.display = 'block';
        Hinweis2.innerText = 'Passwort nicht korrekt. Überprüfe die Schreibweise!';
        window.SendAnalyticsStep('Fehlerhaftes Passwort');
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
    window.SendAnalyticsStep('Displayname gesetzt: ' + displayname.value);
};

loginform5.onsubmit = function (event) {
    event.preventDefault();
    if (localStorage.getItem('displayname')) {
        usname.innerText = founduser.displayname;
    }
    localStorage.setItem('allowedcookies', true);
    nutzerdatenAendern(founduser.username, { allowedcookies: true })
    SendAnalyticsStep('Nutzer hat Cookies erlaubt');
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
            window.location.reload()

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
    Hinweis3.innerText = 'Name erfolgreich geändert!';
    SendAnalyticsStep('Nutzer hat Displayname geändert: ' + setdisplayname.value);
}