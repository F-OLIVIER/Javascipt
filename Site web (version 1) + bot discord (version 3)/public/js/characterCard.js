import { adressAPI } from "./home.js";
import { cookieName } from "./main.js";
import { communBlock, createHTMLElement } from "./useful.js";

export function characterCard() {
    if (!document.cookie.split(";").some((item) => item.trim().startsWith(cookieName + "="))) {
        window.location.href = '/';
    }
    console.log('ENTER caserne JS')
    // Si le cookie est present, fetch des données. Le back fera une vérification de la validité du cookie
    fetch(adressAPI + 'charactercard')
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
            // console.log('Data received (characterCard):', data);
            containerCharacterCard(data);
        })
        .catch(error => {
            // Gérer les erreurs
            console.error('Data recovery error:', error);
        });
}

function containerCharacterCard(data) {
    if (data.Gestion.Logged) {
        communBlock(data);

        let container = document.getElementById('Container');
        let subcontainer = createHTMLElement('div', 'subcontainerProfile');

        let divError = createHTMLElement('div', 'divError');
        divError.style.display = 'none';
        subcontainer.appendChild(divError)

        let divMAJ = createHTMLElement('div', 'divMAJ');

        let personnage = createHTMLElement('div', 'personnage');
        let titlepersonnage = createHTMLElement('div', 'titlepersonnage');
        titlepersonnage.textContent = 'Informations du héros';
        personnage.appendChild(titlepersonnage);

        // class
        let classeplay = document.createElement('div');
        classeplay.textContent = 'Classe actuel : ' + data.UserInfo.GameCharacter;
        personnage.appendChild(classeplay);
        let changeClass = createHTMLElement('div', 'changeInfo');
        let titlechangeClass = document.createElement('div');
        titlechangeClass.innerHTML = 'Changer de classe : ';
        changeClass.appendChild(titlechangeClass);
        let selectchangeClass = createHTMLElement('select', 'newClass');
        let defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.text = "Choisissez";
        selectchangeClass.appendChild(defaultOption);
        for (let i = 0; i < data.Gestion.ListClass.length; i++) {
            let option = document.createElement('option');
            option.value = data.Gestion.ListClass[i];
            option.text = data.Gestion.ListClass[i];
            selectchangeClass.appendChild(option);
        }
        changeClass.appendChild(selectchangeClass);
        personnage.appendChild(changeClass);

        // level
        let lvl = document.createElement('div');
        if (data.UserInfo.Lvl == 0) {
            lvl.textContent = 'Level jamais saisie';
        } else {
            lvl.textContent = 'Level actuel : ' + data.UserInfo.Lvl;
        }
        personnage.appendChild(lvl);
        let changelvl = createHTMLElement('div', 'changeInfo');
        let titlechangelvl = document.createElement('div');
        titlechangelvl.innerHTML = 'Changer de level : ';
        changelvl.appendChild(titlechangelvl);
        let inputlvl = createHTMLElement('input', 'newlvl');
        inputlvl.placeholder = "Nouveau level";
        inputlvl.type = 'number';
        changelvl.appendChild(inputlvl);
        personnage.appendChild(changelvl);

        // influence
        let influence = document.createElement('div');
        influence.innerHTML = 'Influence actuel : ' + data.UserInfo.Influence;
        personnage.appendChild(influence);
        let changeInflu = createHTMLElement('div', 'changeInfo');
        let titlechangeInflu = document.createElement('div');
        titlechangeInflu.innerHTML = "Changer l'influence : ";
        changeInflu.appendChild(titlechangeInflu);
        let inputInflu = createHTMLElement('input', 'newInflu');
        inputInflu.placeholder = "Nouvelle influence";
        inputInflu.type = 'number';
        changeInflu.appendChild(inputInflu);
        personnage.appendChild(changeInflu);

        let buttonMAJpersonnage = createHTMLElement('button', 'buttonMAJpersonnage');
        buttonMAJpersonnage.textContent = "Mettre à jour mon personnage"
        personnage.appendChild(buttonMAJpersonnage);
        divMAJ.appendChild(personnage);

        // Information GvG
        let infoGvG = createHTMLElement('div', 'infoGvG');
        let titleinfoGvG = createHTMLElement('div', 'titleinfoGvG');
        titleinfoGvG.textContent = 'Informations GvG';
        infoGvG.appendChild(titleinfoGvG);
        let etatInscripted = document.createElement('div');
        let listButton = createHTMLElement('div', 'listButton');
        if (data.UserInfo.EtatInscription === 0) {
            etatInscripted.textContent = "⁉️ Vous n'éte pas inscrit pour la prochaine GvG";
            // button present
            let buttonPresent = createHTMLElement('button', 'inscriptedPresent');
            buttonPresent.textContent = "M'inscrire présent"
            listButton.appendChild(buttonPresent);
            // button absent
            let buttonAbsent = createHTMLElement('button', 'inscriptedAbsent');
            buttonAbsent.textContent = "M'inscrire absent"
            listButton.appendChild(buttonAbsent);
        } else if (data.UserInfo.EtatInscription == 1) {
            etatInscripted.textContent = "✅ Inscrit présent pour la prochaine GvG";
            // button absent
            let buttonAbsent = createHTMLElement('button', 'inscriptedAbsent');
            buttonAbsent.textContent = "M'inscrire absent"
            listButton.appendChild(buttonAbsent);
        } else if (data.UserInfo.EtatInscription == 3) {
            etatInscripted.textContent = "❌ inscrit absent pour la prochaine GvG";
            // button present
            let buttonPresent = createHTMLElement('button', 'inscriptedPresent');
            buttonPresent.textContent = "M'inscrire présent"
            listButton.appendChild(buttonPresent);
        }
        infoGvG.appendChild(etatInscripted);
        infoGvG.appendChild(listButton);

        let nbGvG = document.createElement('div');
        nbGvG.textContent = 'Nombre de gvg participé : ' + data.UserInfo.NbGvGParticiped;
        infoGvG.appendChild(nbGvG);
        let lastGvG = document.createElement('div');
        lastGvG.textContent = 'Derniére gvg participé : ' + data.UserInfo.DateLastGvGParticiped;
        infoGvG.appendChild(lastGvG);
        divMAJ.appendChild(infoGvG)
        subcontainer.appendChild(divMAJ);
        container.appendChild(subcontainer);

        document.getElementById('buttonMAJpersonnage').addEventListener('click', () => {
            majPersonnage();
        });

        if (document.getElementById('inscriptedPresent')) {
            document.getElementById('inscriptedPresent').addEventListener('click', () => {
                changeInscription(true);
            });
        }
        if (document.getElementById('inscriptedAbsent')) {
            document.getElementById('inscriptedAbsent').addEventListener('click', () => {
                changeInscription(false);
            });
        }

    } else {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/';
    }
}

function majPersonnage() {
    let dataToSend = {}
    dataToSend.GameCharacter = document.getElementById('newClass').value;
    dataToSend.Lvl = document.getElementById('newlvl').value;
    dataToSend.Influence = document.getElementById('newInflu').value;

    if (dataToSend.Influence === "" && dataToSend.Lvl === "" && dataToSend.GameCharacter === "") {
        let divError = document.getElementById('divError');
        divError.textContent = "Tous les champs de mise à jour de votre héros sont vide !!!";
        divError.style.display = 'block';
    } else {
        fetchData(dataToSend)
    }

}

function changeInscription(incripted) {
    let dataToSend = {}
    if (incripted) {
        dataToSend.EtatInscription = 1; // present
    } else {
        dataToSend.EtatInscription = 3; // absent
    }
    fetchData(dataToSend)
}

function fetchData(dataToSend) {
    fetch(adressAPI + 'updateCharacterCard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
    })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        });

    window.location.href = '/characterCard';
}