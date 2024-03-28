import { adressAPI } from "./home.js";
import { cookieName } from "./main.js";
import { communBlock, createHTMLElement } from "./useful.js";

export function caserne() {
    if (!document.cookie.split(";").some((item) => item.trim().startsWith(cookieName + "="))) {
        window.location.href = '/';
    }
    console.log('ENTER caserne JS')
    // Si le cookie est present, fetch des données. Le back fera une vérification de la validité du cookie
    fetch(adressAPI + 'caserne')
        .then(response => {
            // Vérifier si la requête a réussi (status code 200)
            if (!response.ok) {
                throw new Error(`Erreur de réseau: ${response.status}`);
            }

            // Convertir la réponse en JSON
            return response.json();
        })
        .then(data => {
            // Traiter les données récupérées
            // console.log('Data received (caserne):', data);
            containercaserne(data);
        })
        .catch(error => {
            // Gérer les erreurs
            console.error('Data recovery error:', error);
        });
}

function containercaserne(data) {
    if (data.Gestion.Logged) {
        communBlock(data)

        let Container = document.getElementById('Container');
        let caserne = createHTMLElement('div', 'caserne');

        let divInfanterie = createHTMLElement('div', 'divInfanterie');
        let TitleDivInfanterie = document.createElement('div');
        TitleDivInfanterie.id = 'titleInfanterie';
        TitleDivInfanterie.classList.add("titlelistUnit");
        TitleDivInfanterie.textContent = "Infanterie"
        let listUnitInfanterie = document.createElement('div');
        listUnitInfanterie.classList.add("listUnit");
        listUnitInfanterie.style.display = 'none';

        let divDistant = createHTMLElement('div', 'divDistant');
        let TitleDivDistant = document.createElement('div');
        TitleDivDistant.id = 'titleDistant';
        TitleDivDistant.classList.add("titlelistUnit");
        TitleDivDistant.textContent = "Distant"
        let listUnitDistant = document.createElement('div');
        listUnitDistant.classList.add("listUnit");
        listUnitDistant.style.display = 'none';

        let divCav = createHTMLElement('div', 'divCav');
        let TitleDivCav = document.createElement('div');
        TitleDivCav.id = 'titleCav';
        TitleDivCav.classList.add("titlelistUnit");
        TitleDivCav.textContent = "Cavalerie"
        let listUnitCav = document.createElement('div');
        listUnitCav.classList.add("listUnit");
        listUnitCav.style.display = 'none';

        for (let i = 0; i < data.ListUnit.length; i++) {
            const Currentunit = data.ListUnit[i];

            let unit = document.createElement('div');
            unit.className = "unit";
            let img = document.createElement('img');
            img.src = Currentunit.Unit_img;
            unit.appendChild(img);
            let name = document.createElement('div');
            name.textContent = Currentunit.Unit_name;
            unit.appendChild(name);
            let selecctlvl = document.createElement('select');
            selecctlvl.name = "Unit" + Currentunit.Unit_id;
            selecctlvl.id = "lvl-unit" + Currentunit.Unit_id;
            let defaultoption = document.createElement("option");
            defaultoption.value = "";
            if (Currentunit.Unit_lvl == Currentunit.Unit_lvlMax) {
                defaultoption.text = 'level ' + Currentunit.Unit_lvl;
                selecctlvl.style.backgroundColor = 'green';
            } else if (Currentunit.Unit_lvl != '') {
                defaultoption.text = 'level ' + Currentunit.Unit_lvl;
                selecctlvl.style.backgroundColor = 'orange';
            } else {
                defaultoption.text = 'Absent de la caserne';
                selecctlvl.style.backgroundColor = 'red';
            }
            selecctlvl.style.borderRadius = '15px';
            selecctlvl.style.fontSize = '16px'
            selecctlvl.appendChild(defaultoption);
            let optionAbsent = document.createElement("option");
            optionAbsent.value = -1;
            optionAbsent.text = 'Absent de la caserne';
            selecctlvl.appendChild(optionAbsent);
            for (let j = 0; j <= Currentunit.Unit_lvlMax; j++) {
                let option = document.createElement("option");
                option.value = j;
                option.text = 'level ' + j;
                selecctlvl.appendChild(option);
            }
            unit.appendChild(selecctlvl);

            if (Currentunit.Unit_type === "Infanterie") {
                listUnitInfanterie.appendChild(unit)
            } else if (Currentunit.Unit_type === "Distant") {
                listUnitDistant.appendChild(unit)
            } else if (Currentunit.Unit_type === "Cavalerie") {
                listUnitCav.appendChild(unit)
            }
        }

        divInfanterie.appendChild(TitleDivInfanterie);
        divInfanterie.appendChild(listUnitInfanterie)
        caserne.appendChild(divInfanterie);
        TitleDivInfanterie.addEventListener('click', function () {
            if (listUnitInfanterie.style.display === 'none') {
                listUnitInfanterie.style.display = 'flex';
            } else {
                listUnitInfanterie.style.display = 'none';
            }
        });

        divDistant.appendChild(TitleDivDistant);
        divDistant.appendChild(listUnitDistant);
        caserne.appendChild(divDistant);
        TitleDivDistant.addEventListener('click', function () {
            if (listUnitDistant.style.display === 'none') {
                listUnitDistant.style.display = 'flex';
            } else {
                listUnitDistant.style.display = 'none';
            }
        });

        divCav.appendChild(TitleDivCav);
        divCav.appendChild(listUnitCav)
        caserne.appendChild(divCav);
        TitleDivCav.addEventListener('click', function () {
            if (listUnitCav.style.display === 'none') {
                listUnitCav.style.display = 'flex';
            } else {
                listUnitCav.style.display = 'none';
            }
        });

        let buttonMAJ = document.createElement('button');
        buttonMAJ.textContent = 'Mettre à jour ma caserne';
        buttonMAJ.id = 'MAJCaserne';
        buttonMAJ.className = 'MAJCaserne';
        caserne.appendChild(buttonMAJ);
        Container.appendChild(caserne);

        MAJCaserne(data.ListUnit.length);

    } else {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/';
    }
}

let timerThrottlebutton = 0;
function MAJCaserne(nbunit) {
    var boutonMAJCaserne = document.getElementById("MAJCaserne");
    boutonMAJCaserne.addEventListener("click", function () {
        const now = new Date();
        if (now - timerThrottlebutton > 500) {
            timerThrottlebutton = now;
            sendDataMAJCaserne(nbunit);
        }
    });
}

function sendDataMAJCaserne(nbunit) {
    // récupération de toutes les valeurs
    let listNewLvlUnitCaserne = [];
    for (let i = 0; i < nbunit; i++) {
        var selectElement = document.getElementById('lvl-unit' + (i + 1));
        let majUnit = [];
        majUnit.push('Unit' + (i + 1));
        majUnit.push(selectElement.value);
        listNewLvlUnitCaserne.push(majUnit);
    }

    const dataToSend = { listNewLvlUnitCaserne };
    console.log("dataToSend : ", dataToSend);

    fetch(adressAPI + 'majcaserne', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur de réseau: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (typeof data === 'object') {
                console.log('Data received (Register):', data);
                location.reload();
            } else {
                throw new Error('Réponse invalide du serveur (non-JSON)');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        });
}