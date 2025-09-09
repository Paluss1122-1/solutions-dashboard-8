const mo = document.getElementById('1');
const di = document.getElementById('2');
const mi = document.getElementById('3');
const don = document.getElementById('4');
const fr = document.getElementById('5');
const settingsframe = document.getElementById('settingsframe')
const settingsf = document.getElementById('settings')
const table = document.getElementById('table')
let weekdays;
let con

let verschiebung = 0;

function loadweek(tagverschiebung = 0) {
    const today = new Date();
    verschiebung += tagverschiebung;
    today.setDate(today.getDate() + verschiebung);

    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    const weekNumber = getWeekNumber(today);
    document.getElementById('kw').innerText = 'KW ' + weekNumber;
    document.getElementById('kw').setAttribute('title', `Kalenderwoche: ${weekNumber}`);

    const day = today.getDay();
    const diffToMonday = (day === 0 ? -6 : 1 - day);
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    weekdays = [];
    for (let i = 0; i < 5; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        weekdays.push(
            d.toLocaleDateString("de-DE", { day: "numeric", month: "long" })
        );
    }

    mo.innerText = weekdays[0];
    di.innerText = weekdays[1];
    mi.innerText = weekdays[2];
    don.innerText = weekdays[3];
    fr.innerText = weekdays[4];
    updatefächer()
    const fächerArray = JSON.parse(localStorage.getItem('Fächerarray') || '["Deutsch", "Englisch", "Mathe"]');
    const num = fächerArray.length;
    const objects = [];
    for (let i = 0; i < num; i++) {
        const element = document.getElementById('fach-' + fächerArray[i]);
        if (element) {
            objects.push(element);
        }
    }
    for (let i = 0; i < weekdays.length; i++) {
        for (let j = 0; j < objects.length; j++) {
            const obj = objects[j];
            const allTds = obj.parentElement.querySelectorAll('td');
            if (allTds.length > i + 1) {
                allTds[i + 1].innerHTML = ''
                allTds[i + 1].setAttribute('id', weekdays[i]);
                const textarea = document.createElement('textarea');
                const input = document.createElement('input')
                input.setAttribute('type', 'checkbox')
                allTds[i + 1].appendChild(textarea);
                allTds[i + 1].appendChild(input);

                // Closure-Problem lösen - Werte in lokale Variablen kopieren
                const weekday = weekdays[i];
                const fachId = objects[j].id; // oder obj.id

                textarea.addEventListener('change', function () {
                    localStorage.setItem(weekday + ', ' + fachId, this.value);
                });

                input.addEventListener('change', function () {
                    localStorage.setItem(weekday + ', ' + fachId + 'value', this.checked);
                });


                // Bestehenden Wert laden, falls vorhanden
                const savedValue = localStorage.getItem(weekday + ', ' + fachId);
                if (savedValue) {
                    textarea.value = savedValue;
                }

                const savedValue1 = localStorage.getItem(weekday + ', ' + fachId + 'value');
                if (savedValue1 !== null) {
                    input.checked = savedValue1 === 'true';
                    if (input.checked) {
                        input.parentElement.querySelector('textarea').setAttribute('readonly', true)
                    } else {
                        input.parentElement.querySelector('textarea').removeAttribute('readonly')
                    }
                }
            }
        }
    }
}

loadweek();

function Settings(open = false) {
    if (open == false) {
        if (!localStorage.getItem('Fächer') || !localStorage.getItem('Fächerarray')) {
            localStorage.setItem('Fächer', '1')
            localStorage.setItem('Fächerarray', JSON.stringify(['Deutsch', 'Englisch', 'Mathe']));
        }
        settingsf.style.display = 'flex'
        settingsframe.innerHTML = ''
        if (localStorage.getItem('Fächerarray')) {
            const fächerArray = JSON.parse(localStorage.getItem('Fächerarray') || '[]');
            const num = fächerArray.length;
            for (let i = 0; i < num; i++) {
                const div = document.createElement('div')
                div.style.display = 'flex'
                const fach = document.createElement('input')
                fach.value = fächerArray[i];
                fach.addEventListener('change', function () {
                    if (fach.value !== '' || fach.value !== ' ') {
                        fächerArray[i] = fach.value
                        localStorage.setItem('Fächerarray', JSON.stringify(fächerArray))
                    }
                })
                const bt2 = document.createElement('button')
                bt2.innerText = 'Löschen'
                bt2.addEventListener('click', function () {
                    div.remove();
                    fächerArray.splice(i, 1);
                    localStorage.setItem('Fächerarray', JSON.stringify(fächerArray));
                    updatefächer();
                    loadweek();
                })
                div.appendChild(fach)
                div.appendChild(bt2)
                settingsframe.appendChild(div)
            }
            const bt = document.createElement('button')
            bt.innerText = 'Fach hinzufügen'
            bt.addEventListener('click', function () {
                bt.remove();
                updatefächer();
                loadweek();
                const div = document.createElement('div')
                div.style.display = 'flex'
                const fach = document.createElement('input')
                const bt2 = document.createElement('button')
                bt2.innerText = 'Löschen'
                bt2.addEventListener('click', function () {
                    div.remove();
                    localStorage.setItem('Fächerarray', JSON.stringify(fächerArray));
                    localStorage.setItem('Fächer', localStorage.getItem('Fächer') - 1)
                    updatefächer();
                    loadweek();
                })
                fach.addEventListener('change', function () {
                    fächerArray.push(fach.value);
                    localStorage.setItem('Fächerarray', JSON.stringify(fächerArray));
                });
                div.appendChild(fach)
                div.appendChild(bt2)
                settingsframe.appendChild(div)
                settingsframe.appendChild(bt)
                let facher = parseInt(localStorage.getItem('Fächer') || "0", 10)
                localStorage.setItem('Fächer', facher += 1)
            })
            settingsframe.appendChild(bt)
        }
    } else {
        window.location.reload()
    }
}

function updatefächer() {
    if (!localStorage.getItem('Fächer') || !localStorage.getItem('Fächerarray')) {
        localStorage.setItem('Fächer', '1')
        localStorage.setItem('Fächerarray', JSON.stringify(['Deutsch', 'Englisch', 'Mathe']));
    }
    const fächerArray = JSON.parse(localStorage.getItem('Fächerarray') || '["Deutsch, Englisch, Mathe"]');
    const num = fächerArray.length;

    for (let i = 0; i < num; i++) {
        if (!document.getElementById('fach-' + fächerArray[i])) {
            const template = document.getElementById('fach');
            const clone = template.content.cloneNode(true);

            // Text setzen
            clone.querySelector('#fachname').innerText = fächerArray[i];

            const fachElement = clone.querySelector('td'); // oder ein anderer Selektor
            if (fachElement) {
                fachElement.setAttribute('id', 'fach-' + fächerArray[i]); // Eindeutige ID
            }

            // Alle td Elemente holen und das zweite auswählen
            const allTds = clone.querySelectorAll('td');
            if (allTds.length > 1) {
                allTds[1].setAttribute('id', weekdays[0 + verschiebung]);
            }

            table.appendChild(clone);
        } else {
            const obj = document.getElementById('fach-' + fächerArray[i]);
            obj.querySelector('h1').innerText = fächerArray[i];
        }
    }
}

function Clear() {
    const keysToDelete = [];

    // Alle localStorage Keys durchlaufen
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        // Prüfen ob der Key das Schema "weekday, fachId" hat
        if (key && key.includes(', ')) {
            keysToDelete.push(key);
        }
    }

    // Keys löschen
    keysToDelete.forEach(key => localStorage.removeItem(key));
}

function main() {
    const checkbox = document.querySelectorAll('input')
    for (let i = 0; i < checkbox.length; i++) {
        const obj = checkbox[i];
        if (obj.getAttribute('type') == 'checkbox') {
            obj.addEventListener('change', function () {
                if (obj.checked) {
                    obj.parentElement.querySelector('textarea').setAttribute('readonly', true)
                } else {
                    obj.parentElement.querySelector('textarea').removeAttribute('readonly')
                }
            })
        }
    }

    const textareas = document.querySelectorAll('textarea');
    for (let i = 0; i < textareas.length; i++) {
        const obj = textareas[i];
        obj.addEventListener('click', function () {
            const checkbox = obj.parentElement.querySelector('input[type="checkbox"]');
            if (!checkbox) return
            if (!checkbox.checked) return
            alert('Du kannst die Hausaufgabe nicht bearbeiten während sie als erledigt markiert ist!');
        });
    }
}

setTimeout(() => {
    main()
}, 1000);

function information(
    text = 'Drehe dein Handy ins Querformat, um das perfekte Erlebnis zu genießen',
    activebts = 1,
    options = { buttontxt: ['Ignorieren'] },
    btclick = () => {
        document.getElementById('information').style.display = 'none';
        document.getElementById('black').style.display = 'none';
        window.con = true;
    }
) {
    const frame = document.getElementById('information');
    const black = document.getElementById('black');
    const t = frame.querySelector('h1');
    const buttons = frame.querySelectorAll('button');

    t.innerText = text;

    // Alle Buttons erstmal ausblenden
    buttons.forEach(btn => btn.style.display = 'none');

    // Dann nur die gewünschten wieder einblenden + Text setzen
    for (let i = 0; i < activebts && i < buttons.length; i++) {
        buttons[i].style.display = 'unset';
        buttons[i].innerText = options.buttontxt[i] || options.buttontxt[0];
        if (i == 1) {
            buttons[i].addEventListener('click', function () {
                document.getElementById('information').style.display = 'none';
                document.getElementById('black').style.display = 'none';
                window.con = true;
            })
        } else {
            buttons[i].onclick = btclick;
        }
    }

    frame.style.display = 'block';
    black.style.display = 'block';
}


function updateVisibility() {
    const info = document.getElementById("information");
    const black = document.getElementById("black");

    if (!info || !black) return;

    if (window.matchMedia("(max-width: 600px) and (orientation: portrait)").matches) {
        information()
    }
    else if (window.matchMedia("(max-width: 900px) and (orientation: landscape)").matches) {
        info.style.display = "none";
        black.style.display = "none";
        con = true;
    }
    else if (window.matchMedia("(min-width: 900px)").matches) {
        info.style.display = "none";
        black.style.display = "none";
        con = true;
    }
}

// Beim Laden prüfen
updateVisibility();

// Bei Resize oder Orientierungswechsel erneut prüfen
window.addEventListener("resize", updateVisibility);
window.addEventListener("orientationchange", updateVisibility);

let s = setInterval(() => {
    if (localStorage.getItem('allowedsb') === "true") {
        clearInterval(s);
        return;
    }

    if (con === true) {
        information(
            'Sollen deine Hausaufgaben auf einem Server gespeichert werden, um diese von anderen Geräten abrufen zu können?',
            2,
            { buttontxt: ['Ja', 'Nein'] },
            () => { 
                localStorage.setItem('allowedsb', "true"); // String speichern
                document.getElementById('information').style.display = 'none';
                document.getElementById('black').style.display = 'none';
            }
        );
        clearInterval(s);
    }
}, 2000);
