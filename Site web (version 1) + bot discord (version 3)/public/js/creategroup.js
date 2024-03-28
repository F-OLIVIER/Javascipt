import { adressAPI } from "./home.js";
import { cookieName } from "./main.js";
import { communBlock, createHTMLElement } from "./useful.js";

export function creategroup() {
    if (!document.cookie.split(";").some((item) => item.trim().startsWith(cookieName + "="))) {
        window.location.href = '/';
    }
    fetch(adressAPI + 'creategroup')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur de réseau: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // console.log('Data received (creategroup):', data);
            containercreategroup(data);
        })
        .catch(error => {
            console.error('Data recovery error:', error);
        });
}

let groupNumber = 1;
export function containercreategroup(data) {
    if (data.Gestion.Logged && data.Gestion.Officier) {
        communBlock(data);

        let Container = document.getElementById('Container');
        let containerGroupe = createHTMLElement('div', 'containerGroupe');

        // affichage de la liste des inscrits
        let divlistInscripted = listInscripted(data.ListInscripted);
        containerGroupe.appendChild(divlistInscripted);
        let divcreategroup = createHTMLElement('div', 'divcreategroup');
        divcreategroup.style.display = 'none';

        // Boutton pour afficher l'encart de création des groupes
        let buttonDisplaycreategroup = createHTMLElement('div', 'buttonDisplaycreategroup');
        buttonDisplaycreategroup.textContent = 'Création des groupes GvG';
        containerGroupe.appendChild(buttonDisplaycreategroup);

        // div de la création des groupes GvG
        let creategroup = createHTMLElement('div', 'creategroup');
        // en-tête
        let titledivuser = entete();
        creategroup.appendChild(titledivuser);
        // div de création des groupes
        divcreategroup.appendChild(creategroup);
        containerGroupe.appendChild(divcreategroup);
        Container.appendChild(containerGroupe);

        // Création des groupes déja existant
        if (data.GroupGvG != null) {
            let groupNumberMax = 0;

            for (let i = 0; i < data.GroupGvG.length; i++) {
                if (data.GroupGvG[i].GroupNumber > groupNumberMax) {
                    groupNumberMax = data.GroupGvG[i].GroupNumber;
                }
            }

            for (let i = 0; i < groupNumberMax; i++) {
                const currentGroupe = usersInGroup(data.GroupGvG);
                createExistGroupe(data, currentGroupe);
                groupNumber += 1;
            }
        }

        // Boutton pour ajouter un groupe (5 joueurs)
        let buttonAddGroup = createHTMLElement('div', 'buttonAddGroup');
        buttonAddGroup.textContent = 'Ajouter un groupe';
        divcreategroup.appendChild(buttonAddGroup);
        buttonAddGroup.addEventListener('click', function () {
            createOneGroupe(data)
            groupNumber += 1;
        });

        // Boutton pour ajouter un groupe (5 joueurs)
        let buttonSaveGroup = createHTMLElement('div', 'buttonSaveGroup');
        buttonSaveGroup.textContent = 'Sauvegarder les groupes';
        divcreategroup.appendChild(buttonSaveGroup);
        buttonSaveGroup.addEventListener('click', function () {
            saveGroup();
            window.location.href = '/creategroup';
        });

        // Boutton pour voir les groupes de façon non modifiable
        if (data.GroupGvG != null) {
            let buttonViewGroup = createHTMLElement('div', 'buttonViewGroup');
            buttonViewGroup.textContent = 'Voir de façon propres les groupes déjà crée';
            containerGroupe.appendChild(buttonViewGroup);
            buttonViewGroup.addEventListener('click', function () {
                // saveGroup();
                window.location.href = '/viewGroup';
            });
        }

        // événements du boutton d'affichage des inscrits
        document.getElementById('buttonDisplayInscripted').addEventListener('click', function () {
            if (document.getElementById('divinscripted').style.display === 'none') {
                document.getElementById('divinscripted').style.display = 'block';
            } else {
                document.getElementById('divinscripted').style.display = 'none';
            }
        });

        // événements du boutton d'affichage des inscrits
        document.getElementById('buttonDisplaycreategroup').addEventListener('click', function () {
            if (document.getElementById('divcreategroup').style.display === 'none') {
                document.getElementById('divcreategroup').style.display = 'block';
            } else {
                document.getElementById('divcreategroup').style.display = 'none';
            }
        });

    } else {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/';
    }
}

function entete() {
    let titledivuser = document.createElement('div');
    titledivuser.classList.add('titledivuser');
    titledivuser.classList.add('divuser');

    let titlename = createHTMLElement('div', 'titlename');
    titlename.textContent = 'pseudo';
    titledivuser.appendChild(titlename);

    let titleinfluence = createHTMLElement('div', 'titleinfluence');
    titleinfluence.innerHTML = 'influence <br> unités / joueur';
    titledivuser.appendChild(titleinfluence);

    let divnameunit = createHTMLElement('div', 'divnameunit');

    let titleunit1 = document.createElement('div');
    titleunit1.textContent = 'unité 1';
    divnameunit.appendChild(titleunit1);

    let titleunit2 = document.createElement('div');
    titleunit2.textContent = 'unité 2';
    divnameunit.appendChild(titleunit2);

    let titleunit3 = document.createElement('div');
    titleunit3.textContent = 'unité 3';
    divnameunit.appendChild(titleunit3);

    let titleunit4 = document.createElement('div');
    titleunit4.textContent = 'unité 4';
    divnameunit.appendChild(titleunit4);
    titledivuser.appendChild(divnameunit);

    return titledivuser
}

async function createExistGroupe(data, userIngroup) {
    const creategroup = document.getElementById('creategroup');
    const groupName = 'group' + groupNumber;
    let divGroup = document.createElement('div');
    divGroup.classList.add('divgroup');
    divGroup.classList.add(groupName);

    for (let i = 0; i < 5; i++) {
        let currentUser = {
            Username: "",
            Unit1: "",
            Unit2: "",
            Unit3: "",
            Unit4: "",
        }

        if (userIngroup[i] != undefined && userIngroup[i] != null) {
            currentUser.ID = userIngroup[i].User_ID;
            currentUser.Username = userIngroup[i].Username;
            currentUser.Unit1 = userIngroup[i].Unit1;
            currentUser.Unit2 = userIngroup[i].Unit2;
            currentUser.Unit3 = userIngroup[i].Unit3;
            currentUser.Unit4 = userIngroup[i].Unit4;
        }

        let divuser = createHTMLElement('div', 'divuser');

        let inputHidden = document.createElement('input');
        inputHidden.value = groupName;
        inputHidden.hidden = true;
        divuser.appendChild(inputHidden);

        let name = document.createElement('select');
        name.className = 'username';
        let defaultoption = document.createElement("option");
        name.appendChild(defaultoption);
        if (currentUser.Username === "") {
            defaultoption.value = "";
            defaultoption.text = "Choisissez";
        } else {
            defaultoption.value = currentUser.Username;
            defaultoption.text = currentUser.Username;
            let option = document.createElement('option');
            option.value = "";
            option.text = "Suprimer le joueur";
            name.appendChild(option);
        }

        if (data.ListInscripted != null) {
            for (let j = 0; j < data.ListInscripted.length; j++) {
                const userInscripted = data.ListInscripted[j];
                if (userInscripted.Username != currentUser.Username) {
                    let option = document.createElement("option");
                    option.value = userInscripted.Username;
                    option.text = userInscripted.Username;
                    name.appendChild(option);
                }
            }
        }
        divuser.appendChild(name);

        let influenceUnit = createHTMLElement('div', 'influenceUnit');
        divuser.appendChild(influenceUnit);
        let influenceplayer = createHTMLElement('div', 'influenceplayer');
        divuser.appendChild(influenceplayer);
        let unit1 = createHTMLElement('div', 'unit1');
        divuser.appendChild(unit1);
        let selectunit1;
        let unit2 = createHTMLElement('div', 'unit2');
        divuser.appendChild(unit2);
        let selectunit2;
        let unit3 = createHTMLElement('div', 'unit3');
        divuser.appendChild(unit3);
        let selectunit3;
        let unit4 = createHTMLElement('div', 'unit4');
        divuser.appendChild(unit4);
        let selectunit4;

        if (currentUser.Username !== "") { // utilisateur present
            let infoUsersave = {};
            for (let j = 0; j < data.ListInscripted.length; j++) {
                let userInscripted = data.ListInscripted[j];
                if (userInscripted.ID === currentUser.ID) {
                    infoUsersave = userInscripted;
                    break;
                }
            }
            let usernameSansEspaces = infoUsersave.Username.replace(/\s/g, '');
            influenceUnit.id = 'influUnit' + usernameSansEspaces;
            influenceUnit.textContent = 0;
            influenceplayer.id = 'influPlayer' + usernameSansEspaces;
            influenceplayer.textContent = '/ ' + infoUsersave.Influence;

            // Unité 1
            selectunit1 = createSelectUnit(1, infoUsersave.UserCaserne, currentUser, usernameSansEspaces, 1)
            unit1.replaceWith(selectunit1);
            // Unité 2
            selectunit2 = createSelectUnit(2, infoUsersave.UserCaserne, currentUser, usernameSansEspaces, 1)
            unit2.replaceWith(selectunit2);
            // Unité 3
            selectunit3 = createSelectUnit(3, infoUsersave.UserCaserne, currentUser, usernameSansEspaces, 1)
            unit3.replaceWith(selectunit3);
            // Unité 4
            selectunit4 = createSelectUnit(4, infoUsersave.UserCaserne, currentUser, usernameSansEspaces, 1)
            unit4.replaceWith(selectunit4);

            createEventSelectUnit(name, influenceplayer, influenceUnit, selectunit1, selectunit2, selectunit3, selectunit4, infoUsersave, usernameSansEspaces)

        } else { // utilisateur non present
            createNewline(name, data, influenceplayer, influenceUnit, unit1, unit2, unit3, unit4);
        }

        // création des events listener
        name.addEventListener('change', function () {
            let userSelected = name.value;

            if (name.value === "") {
                if (selectunit1 != undefined) {
                    selectunit1.style.visibility = 'hidden';
                    selectunit1.value = "";
                    if (selectunit2 != undefined) {
                        selectunit2.style.visibility = 'hidden';
                        selectunit2.value = "";
                        if (selectunit3 != undefined) {
                            selectunit3.style.visibility = 'hidden';
                            selectunit3.value = "";
                            if (selectunit4 != undefined) {
                                selectunit4.style.visibility = 'hidden';
                                selectunit4.value = "";
                            }
                        }
                    }
                }
                influenceUnit.textContent = "";
                influenceplayer.textContent = "";
            } else {
                if (selectunit1 != undefined) {
                    selectunit1.style.visibility = 'visible';
                }

                let infoUserSelected = {};
                for (let j = 0; j < data.ListInscripted.length; j++) {
                    let userInscripted = data.ListInscripted[j];
                    if (userInscripted.id === userSelected.id) {
                        infoUserSelected = userInscripted;
                        break;
                    }
                }
                let usernameSansEspaces = infoUserSelected.Username.replace(/\s/g, '');
                influenceUnit.id = 'influUnit' + usernameSansEspaces;
                influenceUnit.textContent = 0;
                influenceplayer.id = 'influPlayer' + usernameSansEspaces;
                influenceplayer.textContent = '/ ' + infoUserSelected.Influence;
            }
        });
        divGroup.appendChild(divuser)
    }

    creategroup.appendChild(divGroup);
    for (let i = 0; i < userIngroup.length; i++) {
        let currentUser = userIngroup[i];
        if (currentUser != undefined && currentUser != null) {
            for (let j = 0; j < data.ListInscripted.length; j++) {
                let userInscripted = data.ListInscripted[j];
                if (userInscripted.ID === currentUser.User_ID) {
                    let usernameSansEspaces = userInscripted.Username.replace(/\s/g, '');
                    changeInfluUnit(userInscripted.UserCaserne, usernameSansEspaces);
                    break;
                }
            }
        }
    }
}

// optionUser 0 = nouvelle utilisateur
// optionUser 1 = utilisateur deja present dans la sauvegarde
function createSelectUnit(numberUnit, caserne, currentUser, usernameSansEspaces, optionUser) {
    let nameUnit = "";
    if (numberUnit === 1) {
        nameUnit = currentUser.Unit1
    } else if (numberUnit === 2) {
        nameUnit = currentUser.Unit2
    } else if (numberUnit === 3) {
        nameUnit = currentUser.Unit3
    } else if (numberUnit === 4) {
        nameUnit = currentUser.Unit4
    }

    let selectunit = createHTMLElement('select', 'unit' + numberUnit + usernameSansEspaces);
    selectunit.name = 'unit' + numberUnit + usernameSansEspaces;
    let defaultoptionUnit = document.createElement("option");
    selectunit.appendChild(defaultoptionUnit);
    for (let j = 0; j < caserne.length; j++) {
        const unit = caserne[j];
        if (nameUnit !== unit.Unit_name) {
            let option = document.createElement('option');
            option.value = unit.Unit_name;
            option.text = unit.Unit_name + ' (lvl ' + unit.Unit_lvl + ')';
            selectunit.appendChild(option);
        } else {
            defaultoptionUnit.value = nameUnit;
            defaultoptionUnit.text = nameUnit + ' (lvl ' + unit.Unit_lvl + ')';
        }
    }

    if (nameUnit !== "" && optionUser == 1) {
        let option = document.createElement('option');
        option.value = "";
        option.text = "Suprimer l'unité";
        selectunit.appendChild(option);
    } else {
        defaultoptionUnit.value = "";
        defaultoptionUnit.text = "Choissisez";
    }

    return selectunit
}

function createEventSelectUnit(divName, influenceplayer, influenceUnit, selectunit1, selectunit2, selectunit3, selectunit4, infoUser, usernameSansEspaces) {
    if (divName.value === "") {
        selectunit1.style.visibility = 'hidden';
        selectunit1.value = "";
        selectunit2.style.visibility = 'hidden';
        selectunit2.value = "";
        selectunit3.style.visibility = 'hidden';
        selectunit3.value = "";
        selectunit4.style.visibility = 'hidden';
        selectunit4.value = "";
        influenceUnit.textContent = 0;
        influenceplayer.textContent = '/ ' + 0;
    } else {
        selectunit1.style.visibility = 'visible';
        if (selectunit1.value === "") {
            selectunit2.style.visibility = 'hidden';
        }
        if (selectunit2.value === "") {
            selectunit3.style.visibility = 'hidden';
        }
        if (selectunit3.value === "") {
            selectunit4.style.visibility = 'hidden';
        }
    }

    selectunit1.addEventListener('change', function () {
        if (selectunit1.value === "") {
            selectunit2.style.visibility = 'hidden';
        } else {
            selectunit2.style.visibility = 'visible';
        }
        changeInfluUnit(infoUser.UserCaserne, usernameSansEspaces);
    });

    selectunit2.addEventListener('change', function () {
        if (selectunit2.value === "") {
            selectunit3.style.visibility = 'hidden';
        } else {
            selectunit3.style.visibility = 'visible';
        }
        changeInfluUnit(infoUser.UserCaserne, usernameSansEspaces);
    });

    selectunit3.addEventListener('change', function () {
        if (selectunit3.value === "") {
            selectunit4.style.visibility = 'hidden';
        } else {
            selectunit4.style.visibility = 'visible';
        }
        changeInfluUnit(infoUser.UserCaserne, usernameSansEspaces);
    });

    selectunit4.addEventListener('change', function () {
        changeInfluUnit(infoUser.UserCaserne, usernameSansEspaces);
    });
}

async function createOneGroupe(data) {
    const creategroup = document.getElementById('creategroup');
    const groupName = 'group' + groupNumber;
    let divGroup = document.createElement('div');
    divGroup.classList.add('divgroup');
    divGroup.classList.add(groupName);

    for (let i = 0; i < 5; i++) {
        let divuser = document.createElement('div');
        // divuser.classList.add(groupName);
        divuser.classList.add('divuser');

        let inputHidden = document.createElement('input');
        inputHidden.value = groupName;
        inputHidden.hidden = true;
        divuser.appendChild(inputHidden);

        let name = createHTMLElement('select', 'username');
        let defaultoption = document.createElement("option");
        defaultoption.value = "";
        defaultoption.text = "Choisissez";
        name.appendChild(defaultoption);
        if (data.ListInscripted != null) {
            for (let j = 0; j < data.ListInscripted.length; j++) {
                const userInscripted = data.ListInscripted[j];
                let option = document.createElement("option");
                option.value = userInscripted.Username;
                option.text = userInscripted.Username;
                name.appendChild(option);
            }
        }
        divuser.appendChild(name);

        let influenceUnit = createHTMLElement('div', 'influenceUnit');
        divuser.appendChild(influenceUnit);
        let influenceplayer = createHTMLElement('div', 'influenceplayer');
        divuser.appendChild(influenceplayer);
        let unit1 = createHTMLElement('div', 'unit1');
        divuser.appendChild(unit1);
        let unit2 = createHTMLElement('div', 'unit2');
        divuser.appendChild(unit2);
        let unit3 = createHTMLElement('div', 'unit3');
        divuser.appendChild(unit3);
        let unit4 = createHTMLElement('div', 'unit4');
        divuser.appendChild(unit4);

        createNewline(name, data, influenceplayer, influenceUnit, unit1, unit2, unit3, unit4);
        divGroup.appendChild(divuser)
    }
    creategroup.appendChild(divGroup)
}

function createNewline(divName, data, influenceplayer, influenceUnit, unit1, unit2, unit3, unit4) {
    let selectunit1;
    let selectunit2;
    let selectunit3;
    let selectunit4;

    divName.addEventListener('change', function () {
        const userSelected = divName.value;

        let infoUserSelected = {};
        for (let j = 0; j < data.ListInscripted.length; j++) {
            let userInscripted = data.ListInscripted[j];
            if (userInscripted.id === userSelected.id) {
                infoUserSelected = userInscripted;
                break;
            }
        }
        let usernameSansEspaces = infoUserSelected.Username.replace(/\s/g, '');
        // Unité 1
        if (selectunit1 === undefined) {
            selectunit1 = createSelectUnit(1, infoUserSelected.UserCaserne, infoUserSelected, usernameSansEspaces)
            unit1.replaceWith(selectunit1);
        }
        // Unité 2
        if (selectunit2 === undefined) {
            selectunit2 = createSelectUnit(2, infoUserSelected.UserCaserne, infoUserSelected, usernameSansEspaces)
            unit2.replaceWith(selectunit2);
        }
        // Unité 3
        if (selectunit3 === undefined) {
            selectunit3 = createSelectUnit(3, infoUserSelected.UserCaserne, infoUserSelected, usernameSansEspaces)
            unit3.replaceWith(selectunit3);
        }
        // Unité 4
        if (selectunit4 === undefined) {
            selectunit4 = createSelectUnit(4, infoUserSelected.UserCaserne, infoUserSelected, usernameSansEspaces)
            unit4.replaceWith(selectunit4);
        }

        if (userSelected !== "") {
            selectunit1.value = "";
            selectunit1.style.visibility = 'visible';
            influenceUnit.id = 'influUnit' + usernameSansEspaces;
            influenceUnit.textContent = 0;
            influenceplayer.id = 'influPlayer' + usernameSansEspaces;
            influenceplayer.textContent = '/ ' + infoUserSelected.Influence;
            createEventSelectUnit(divName, influenceplayer, influenceUnit, selectunit1, selectunit2, selectunit3, selectunit4, infoUserSelected, usernameSansEspaces)
        } else {
            influenceplayer.textContent = "";
            influenceUnit.textContent = "";
            selectunit1.value = "";
            selectunit1.style.visibility = 'hidden';
        }
        selectunit2.value = "";
        selectunit2.style.visibility = 'hidden';
        selectunit3.value = "";
        selectunit3.style.visibility = 'hidden';
        selectunit4.value = "";
        selectunit4.style.visibility = 'hidden';
    });
}

function changeInfluUnit(UserCaserne, username) {
    let unitValues = [];
    for (let i = 1; i <= 4; i++) {
        let unitElement = document.getElementById('unit' + i + username);
        let unit = unitElement ? unitElement.value : null;
        unitValues.push(unit);
    }

    let newValue = 0;
    for (let j = 0; j < UserCaserne.length; j++) {
        const unit = UserCaserne[j];
        if (unitValues.includes(unit.Unit_name)) {
            newValue += parseInt(unit.Unit_influence, 10);
        }
    }
    let divInfluenceUnit = document.getElementById('influUnit' + username);
    divInfluenceUnit.textContent = newValue;
    let divInfluenceplayer = document.getElementById('influPlayer' + username);
    let influenceplayer = parseInt(divInfluenceplayer.textContent, 10);
    if (influenceplayer < newValue) {
        divInfluenceUnit.style.color = 'red';
    } else {
        divInfluenceUnit.style.color = 'white';
    }
}

function saveGroup() {
    const creategroup = document.getElementById('creategroup');
    const divuserElements = creategroup.querySelectorAll('.divuser');

    let dataToSend = [];
    divuserElements.forEach((divuserElement) => {
        let divuserObject = {};

        const inputElement = divuserElement.querySelector('input');
        const inputValue = inputElement ? inputElement.value : '';
        divuserObject['inputValue'] = inputValue;

        const selectElements = divuserElement.querySelectorAll('select');
        const selectValues = Array.from(selectElements).map(select => select.value);
        divuserObject['selectValues'] = selectValues;

        dataToSend.push(divuserObject);
    });

    if (dataToSend.length !== 0) {
        fetch(adressAPI + 'saveGroupInDB', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dataToSend }),
        })
            .catch(error => {
                console.error('Erreur lors de la récupération des données:', error);
            });
    }
}

function usersInGroup(listGroupGvG) {
    let usersInGroup = [];
    for (let i = 0; i < listGroupGvG.length; i++) {
        const currentUser = listGroupGvG[i];
        if (groupNumber == currentUser.GroupNumber) {
            usersInGroup.push(currentUser);
        }
    }
    return usersInGroup
}

function listInscripted(data) {
    let divlistInscripted = createHTMLElement('div', 'listInscripted');

    // Boutton pour afficher la liste des inscrits
    let buttonDisplayInscripted = createHTMLElement('div', 'buttonDisplayInscripted');
    buttonDisplayInscripted.id = 'buttonDisplayInscripted';
    buttonDisplayInscripted.textContent = 'Liste des inscrits';
    divlistInscripted.appendChild(buttonDisplayInscripted);

    let divinscripted = createHTMLElement('div', 'divinscripted');
    divinscripted.id = 'divinscripted';
    divinscripted.style.display = 'none';

    // en tête liste des inscrits
    let titledivuser = document.createElement('div');
    titledivuser.classList.add('inscriptedtitledivuser');
    titledivuser.classList.add('inscripted');

    let titledivconnected = createHTMLElement('div', 'divconnected');
    titledivuser.appendChild(titledivconnected);

    let titlename = createHTMLElement('div', 'inscriptedname');
    titlename.textContent = 'pseudo';
    titledivuser.appendChild(titlename);

    let titleinfluence = createHTMLElement('div', 'inscriptedinfluence');
    titleinfluence.innerHTML = 'influence joueur';
    titledivuser.appendChild(titleinfluence);

    let titleclass = createHTMLElement('div', 'inscriptedclass');
    titleclass.innerHTML = 'classe joué';
    titledivuser.appendChild(titleclass);
    divinscripted.appendChild(titledivuser)

    // liste des inscrits
    if (data !== null) {
        for (let i = 0; i < data.length; i++) {
            const player = data[i];
;
            let divuser = createHTMLElement('div', 'inscripted');
            let divconnected = createHTMLElement('div', 'divconnected');

            if (player.ConnectedSite === "1") {
                divconnected.textContent = '✅';
            } else {
                divconnected.textContent = '❌';
            }
            divuser.appendChild(divconnected);

            let name = createHTMLElement('div', 'inscriptedname');
            name.textContent = player.Username;
            divuser.appendChild(name);

            let influence = createHTMLElement('div', 'inscriptedinfluence');
            influence.innerHTML = player.Influence;
            divuser.appendChild(influence);

            let classPlayer = createHTMLElement('div', 'inscriptedclass');
            classPlayer.innerHTML = player.GameCharacter;
            divuser.appendChild(classPlayer);
            divinscripted.appendChild(divuser)
        }
    }
    divlistInscripted.appendChild(divinscripted);
    return divlistInscripted
}