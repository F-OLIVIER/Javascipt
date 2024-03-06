import { adressAPI } from "./home.js";
import { cookieName } from "./main.js";
import { communBlock } from "./useful.js";

export function administration() {
    if (!document.cookie.split(";").some((item) => item.trim().startsWith(cookieName + "="))) {
        window.location.href = '/';
    }
    // Si le cookie est present, fetch des données. Le back fera une vérification de la validité du cookie
    fetch(adressAPI + 'CheckAppAdmin')
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
            console.log('Data received (administration):', data);
            containerAppAdmin(data);
        })
        .catch(error => {
            // Gérer les erreurs
            console.error('Data recovery error:', error);
        });
}

function containerAppAdmin(data) {
    if (data.Gestion.Logged && data.Gestion.Officier) {
        communBlock(data)

        let subContainer = document.createElement('div');
        subContainer.className = 'subContainerbotEtat';

        // Etat du bot
        let divBotEtat = document.createElement('div');
        divBotEtat.className = 'divBotEtat';
        let botEtat = document.createElement('div');
        botEtat.className = 'botEtat';
        let buttonBotEtat = document.createElement('button');
        buttonBotEtat.id = 'buttonBotEtat';
        buttonBotEtat.className = 'buttonBotEtat';
        if (data.Gestion.BotActivate) {
            botEtat.textContent = "Bot discord actif";
            buttonBotEtat.value = "false";
            buttonBotEtat.textContent = 'Désactiver le bot';
        } else {
            botEtat.textContent = "Bot discord inactif";
            buttonBotEtat.value = "true";
            buttonBotEtat.textContent = 'Activer le bot';
        }
        divBotEtat.appendChild(botEtat);
        divBotEtat.appendChild(buttonBotEtat);
        subContainer.appendChild(divBotEtat);

        // Ajouter une unité
        let divErrorAddUnit = document.createElement('div');
        divErrorAddUnit.id = 'divErrorAddUnit';
        divErrorAddUnit.className = 'divError';
        divErrorAddUnit.style.display = 'none';
        subContainer.appendChild(divErrorAddUnit);

        let divNewUnit = document.createElement('div');
        divNewUnit.className = 'divNewUnit';
        let titleNewUnit = document.createElement('div');
        titleNewUnit.className = 'titleNewUnit'
        titleNewUnit.textContent = 'Ajouter une nouvelle unité';
        divNewUnit.appendChild(titleNewUnit);

        let formNewUnit = document.createElement('form');
        formNewUnit.id = 'formNewUnit';
        formNewUnit.method = 'POST';
        formNewUnit.className = 'newUnit';
        formNewUnit.enctype = 'multipart/form-data';
        // Unit_name
        let input_Unit_name = document.createElement('input');
        input_Unit_name.id = 'nameNewUnit';
        input_Unit_name.placeholder = "Nom de l'unité";
        input_Unit_name.required;
        formNewUnit.appendChild(input_Unit_name);
        // Unit_influence
        let input_Unit_influence = document.createElement('input');
        input_Unit_influence.id = 'influNewUnit';
        input_Unit_influence.type = 'number';
        input_Unit_influence.required;
        input_Unit_influence.placeholder = "Influence de l'unité";
        formNewUnit.appendChild(input_Unit_influence);
        // Unit_lvlMax
        let input_Unit_lvlMax = document.createElement('input');
        input_Unit_lvlMax.id = 'lvlMaxNewUnit';
        input_Unit_lvlMax.type = 'number';
        input_Unit_lvlMax.required;
        input_Unit_lvlMax.placeholder = "Level max de l'unité";
        formNewUnit.appendChild(input_Unit_lvlMax);
        // Unit_tier
        let input_Unit_tier = document.createElement('select');
        input_Unit_tier.id = 'tierNewUnit';
        input_Unit_tier.required;
        let title_option_Unit_tier = ["Tier de l'unité", "T3", "T4", "T5"];
        let option_Unit_tier = ["", "T3", "T4", "T5"];
        for (let i = 0; i < option_Unit_tier.length; i++) {
            let option = document.createElement('option');
            option.value = option_Unit_tier[i];
            option.text = title_option_Unit_tier[i];
            input_Unit_tier.appendChild(option);
        }
        formNewUnit.appendChild(input_Unit_tier);
        // Unit_type
        let input_Unit_type = document.createElement('select');
        input_Unit_type.id = 'typeNewUnit';
        input_Unit_type.required;
        let titleOption_Unit_type = ["Type d'unité", "Infanterie", "Distant", "Cavalerie"];
        let option_Unit_type = ["", "Infanterie", "Distant", "Cavalerie"];
        for (let i = 0; i < option_Unit_type.length; i++) {
            let option = document.createElement('option');
            option.value = option_Unit_type[i];
            option.text = titleOption_Unit_type[i];
            input_Unit_type.appendChild(option);
        }
        formNewUnit.appendChild(input_Unit_type);

        // Unit_img
        let input_Unit_img = document.createElement('input');
        input_Unit_img.id = 'imgNewUnit';
        input_Unit_img.required;
        input_Unit_img.type = 'file';
        input_Unit_img.lang = 'fr';
        input_Unit_img.accept = '.jpg, .jpeg, .png,';
        formNewUnit.appendChild(input_Unit_img);

        // button
        let buttonNewUnit = document.createElement('button');
        buttonNewUnit.id = 'buttonNewUnit';
        buttonNewUnit.className = 'buttonNewUnit';
        buttonNewUnit.textContent = "Ajouter l'unité";
        buttonNewUnit.type = 'submit';
        formNewUnit.appendChild(buttonNewUnit);

        divNewUnit.appendChild(formNewUnit);
        subContainer.appendChild(divNewUnit);

        // Modifier une unité
        let divErrorChangeUnit = document.createElement('div');
        divErrorChangeUnit.id = 'divErrorChangeUnit';
        divErrorChangeUnit.className = 'divError';
        divErrorChangeUnit.style.display = 'none';
        subContainer.appendChild(divErrorChangeUnit);

        let divChangeUnit = document.createElement('div');
        divChangeUnit.id = 'divChangeUnit';
        divChangeUnit.className = 'divChangeUnit';
        let titleChangeUnit = document.createElement('div');
        titleChangeUnit.className = 'titleChangeUnit'
        titleChangeUnit.textContent = 'Modifier une unité';
        divChangeUnit.appendChild(titleChangeUnit);
        let formChangeUnit = document.createElement('form');
        formChangeUnit.enctype = 'multipart/form-data';
        formChangeUnit.method = 'POST';
        formChangeUnit.id = 'formchangeUnit';
        formChangeUnit.className = 'formchangeUnit';
        let selectChangeUnit = document.createElement('select');
        selectChangeUnit.id = 'selectChangeUnit';
        let defaultChangeUnit = document.createElement('option');
        defaultChangeUnit.value = "";
        defaultChangeUnit.text = "Choisissez";
        selectChangeUnit.appendChild(defaultChangeUnit);
        for (let i = 0; i < data.ListUnit.length; i++) {
            const currentUnit = data.ListUnit[i];
            let option = document.createElement('option');
            option.value = currentUnit.Unit_name;
            option.text = currentUnit.Unit_name;
            selectChangeUnit.appendChild(option);
        }
        formChangeUnit.appendChild(selectChangeUnit);
        divChangeUnit.appendChild(formChangeUnit);
        subContainer.appendChild(divChangeUnit);

        let Container = document.getElementById('Container');
        Container.innerHTML = '';
        Container.appendChild(subContainer);

        addEventOnAllButton(data.ListUnit);

    } else {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/';
    }
}

function addEventOnAllButton(listUnit) {
    // Activation/Désactivation du bot
    document.getElementById('buttonBotEtat').addEventListener('click', () => {
        adminitrateBot('buttonBotEtat');
    });

    // Ajout d'une nouvelle unité
    document.getElementById('formNewUnit').addEventListener('submit', (event) => {
        event.preventDefault();
        adminitrateBot('buttonNewUnit');
    });

    // Modification d'une unité existante
    let selectChangeUnit = document.getElementById('selectChangeUnit');
    selectChangeUnit.addEventListener('change', () => {
        let unitSelected;
        for (let i = 0; i < listUnit.length; i++) {
            if (selectChangeUnit.value === listUnit[i].Unit_name) {
                unitSelected = listUnit[i];
                break;
            }
        }

        // suppression des anciens éléments si existant
        if (document.getElementById('changeUnitInfluence')) {
            document.getElementById('changeUnitInfluence').remove();
            document.getElementById('changeUnitLvlMax').remove();
            // document.getElementById('changeUnitTier').remove();
            document.getElementById('changeUnitimg').remove();
            document.getElementById('buttonChangeUnit').remove();
        }

        if (selectChangeUnit.value != "") {
            // Ajout des nouveaux éléments
            let formChangeUnit = document.getElementById('formchangeUnit');
            // Unit_influence
            let input_Unit_influence = document.createElement('input');
            input_Unit_influence.id = 'changeUnitInfluence';
            input_Unit_influence.type = 'number';
            input_Unit_influence.placeholder = 'Influence actuel : ' + unitSelected.Unit_influence;
            formChangeUnit.appendChild(input_Unit_influence);
            // Unit_lvlMax
            let input_Unit_lvlMax = document.createElement('input');
            input_Unit_lvlMax.id = 'changeUnitLvlMax';
            input_Unit_lvlMax.type = 'number';
            input_Unit_lvlMax.placeholder = 'Level max actuel : ' + unitSelected.Unit_lvlMax;
            formChangeUnit.appendChild(input_Unit_lvlMax);
            // Unit_tier
            // let input_Unit_tier = document.createElement('select');
            // input_Unit_tier.id = 'changeUnitTier';
            // let option_Unit_tier = [unitSelected.Unit_tier, "T3", "T4", "T5"];
            // console.log('unitSelected.Unit_tier : ', unitSelected.Unit_tier)
            // let defaultOption_Unit_tier = document.createElement('option');
            // defaultOption_Unit_tier.value = unitSelected.Unit_tier;
            // defaultOption_Unit_tier.text = unitSelected.Unit_tier;
            // input_Unit_tier.appendChild(defaultOption_Unit_tier);
            // for (let i = 0; i < option_Unit_tier.length; i++) {
            //     if (option_Unit_tier[i] !== unitSelected.Unit_tier) {
            //         let option = document.createElement('option');
            //         option.value = option_Unit_tier[i];
            //         option.text = option_Unit_tier[i];
            //         input_Unit_tier.appendChild(option);
            //     }
            // }
            // formChangeUnit.appendChild(input_Unit_tier);

            // Unit_img
            let input_Unit_img = document.createElement('input');
            input_Unit_img.id = 'changeUnitimg';
            input_Unit_img.type = 'file';
            input_Unit_img.lang = 'fr';
            input_Unit_img.accept = '.jpg, .jpeg, .png,';
            formChangeUnit.appendChild(input_Unit_img);

            // button
            let buttonChangeUnit = document.createElement('button');
            buttonChangeUnit.id = 'buttonChangeUnit';
            buttonChangeUnit.type = 'submit';
            buttonChangeUnit.className = 'buttonChangeUnit';
            buttonChangeUnit.textContent = "Modifier l'unité";
            formChangeUnit.appendChild(buttonChangeUnit);

            let divChangeUnit = document.getElementById('divChangeUnit');
            divChangeUnit.appendChild(formChangeUnit);
        }

        document.getElementById('formchangeUnit').addEventListener('submit', (event) => {
            event.preventDefault();
            adminitrateBot('buttonChangeUnit');
        });
    });
}

// option et le name du button cliquer
async function adminitrateBot(option) {
    let dataToSend = {};

    // activate or desactivate bot
    if (option === 'buttonBotEtat') {
        dataToSend.Allumage = document.getElementById('buttonBotEtat').value; // false = desactivation, true = activation

        fetch(adressAPI + 'activateOrNotBot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),

        })
            .catch(error => {
                console.error('Erreur avec les données:', error);
            });
    } else {
        let formData = new FormData();

        // create Unit
        if (option === 'buttonNewUnit') {
            let createUnit = {};
            createUnit.Unit_name = document.getElementById('nameNewUnit').value;
            createUnit.Unit_influence = document.getElementById('influNewUnit').value;
            createUnit.Unit_lvlMax = document.getElementById('lvlMaxNewUnit').value;
            createUnit.Unit_tier = document.getElementById('tierNewUnit').value;
            createUnit.Unit_type = document.getElementById('typeNewUnit').value;
            dataToSend.createUnit = createUnit;
            formData.append('data', JSON.stringify(dataToSend));

            let input_new_img = document.getElementById('imgNewUnit');
            if (input_new_img.files && input_new_img.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var image = new Image();
                    image.src = e.target.result;
                    formData.append('image', input_new_img.files[0]);
                    // console.log('1- dataToSend : ', dataToSend);
                    // formData.forEach((value, key) => {
                    //     console.log(key, value);
                    // });
                    if (createUnit.Unit_name === "" ||
                        createUnit.Unit_influence === "" ||
                        createUnit.Unit_lvlMax === "" ||
                        createUnit.Unit_tier === "" ||
                        createUnit.Unit_type === "") {
                        let divError = document.getElementById('divErrorAddUnit');
                        divError.textContent = "Merci de compléter tout les champs pour la création de la nouevelle unité";
                        divError.style.display = 'block';

                    } else {
                        sendFormData(formData);
                        window.location.href = '/AppAdmin';
                    }
                };
                // Démarrer la lecture du fichier
                reader.readAsDataURL(input_new_img.files[0]);
            } else {
                let divError = document.getElementById('divErrorAddUnit');
                divError.textContent = "Merci de compléter tout les champs et mettre l'image pour la création de la nouvelle unité";
                divError.style.display = 'block';
            }
        }

        // change Unit
        if (option === 'buttonChangeUnit') {
            let changeUnit = {};
            changeUnit.Unit_name = document.getElementById('selectChangeUnit').value;
            changeUnit.Unit_influence = document.getElementById('changeUnitInfluence').value;
            changeUnit.Unit_lvlMax = document.getElementById('changeUnitLvlMax').value;
            // changeUnit.Unit_tier = document.getElementById('changeUnitTier').value;
            dataToSend.changeUnit = changeUnit;
            formData.append('data', JSON.stringify(dataToSend));

            let input_change_img = document.getElementById('changeUnitimg');
            if (input_change_img.files && input_change_img.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    let image = new Image();
                    image.src = e.target.result;
                    formData.append('image', input_change_img.files[0]);
                    sendFormData(formData);
                    window.location.href = '/AppAdmin';
                };
                reader.readAsDataURL(input_change_img.files[0]);
            } else if (changeUnit.Unit_influence == "" && changeUnit.Unit_lvlMax == "") {
                let divErrorChangeUnit = document.getElementById('divErrorChangeUnit');
                divErrorChangeUnit.textContent = "Merci de compléter au moins un champs ou mettre une image pour mettre à jour l'unité " + changeUnit.Unit_name;
                divErrorChangeUnit.style.display = 'block';
            } else { // si send des data uniquement
                sendFormData(formData);
                window.location.href = '/AppAdmin';
            }
        }
    }
}

function sendFormData(formData) {
    // console.log('formData : ', formData);
    fetch(adressAPI + 'adminitrateBot', {
        method: 'POST',
        body: formData
    })
        .catch(error => {
            console.error('Erreur lors de l\'envoi de l\'image et des données:', error);
        });
}
