import { cookieName } from "./main.js";
import { communBlock } from "./useful.js";

export const adressAPI = 'http://localhost:53134/api/';

export function home() {
  if (!document.cookie.split(";").some((item) => item.trim().startsWith(cookieName + "="))) {
    window.location.href = '/';
  }
  console.log('ENTER HOME JS')
  // Si le cookie est present, fetch des données. Le back fera une vérification de la validité du cookie
  fetch(adressAPI + 'home')
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
      console.log('Data received (home):', data);
      containerhome(data);
    })
    .catch(error => {
      // Gérer les erreurs
      console.error('Data recovery error:', error);
    });
}


function containerhome(data) {
  if (data.Gestion.Logged) {
    communBlock(data)

    let Container = document.getElementById('Container');
    Container.innerHTML = '';

    // page characterCard
    let subContainer = document.createElement('div');
    subContainer.className = 'subContainer';
    let linkCharacterCard = document.createElement('a');
    linkCharacterCard.href = '/characterCard';
    linkCharacterCard.classList.add('no-style-link');
    let buttoncharacterCard = document.createElement('div');
    buttoncharacterCard.className = 'buttoncharacterCard';
    buttoncharacterCard.id = 'buttonCharacterCard';
    buttoncharacterCard.textContent = 'Ma fiche personnage';
    linkCharacterCard.appendChild(buttoncharacterCard);
    subContainer.appendChild(linkCharacterCard);

    // page caserne
    let linkCaserne = document.createElement('a');
    linkCaserne.href = '/caserne';
    linkCaserne.classList.add('no-style-link');
    let buttonCaserne = document.createElement('div');
    buttonCaserne.id = 'buttonCaserne';
    buttonCaserne.className = 'buttonCaserne';
    buttonCaserne.textContent = 'Modifier ma caserne';
    linkCaserne.appendChild(buttonCaserne);
    subContainer.appendChild(linkCaserne);

    if (data.Gestion.Officier) { // si officier, affichage bouton création des groupes et bouton administration
      let subcontainerOfficier = document.createElement('div');
      subcontainerOfficier.className = 'subcontainerOfficier';

      let titlesubcontainerOfficier = document.createElement('div');
      titlesubcontainerOfficier.className = 'titlesubcontainerOfficier';
      titlesubcontainerOfficier.textContent = "Réservé aux officiers";
      subcontainerOfficier.appendChild(titlesubcontainerOfficier);

      // page création des groupes gvg
      let linkCreateGroup = document.createElement('a');
      linkCreateGroup.href = '/creategroup';
      linkCreateGroup.classList.add('no-style-link');
      let buttonCreateGroup = document.createElement('div');
      buttonCreateGroup.id = 'buttonCreateGroup';
      buttonCreateGroup.className = 'buttonCreateGroup';
      buttonCreateGroup.href = '/creategroup';
      buttonCreateGroup.textContent = 'Créer les groupes GvG';
      linkCreateGroup.appendChild(buttonCreateGroup);
      subcontainerOfficier.appendChild(linkCreateGroup);

      // page des statistiques
      let linkStat = document.createElement('a');
      linkStat.href = '/Stat';
      linkStat.classList.add('no-style-link');
      let buttonStat = document.createElement('div');
      buttonStat.id = 'buttonStat';
      buttonStat.className = 'buttonStat';
      buttonStat.textContent = 'Statistique des GvG';
      linkStat.appendChild(buttonStat);
      subcontainerOfficier.appendChild(linkStat);

      // page d'administration
      let linkAppAdmin = document.createElement('a');
      linkAppAdmin.href = '/AppAdmin';
      linkAppAdmin.classList.add('no-style-link');
      let buttonAppAdmin = document.createElement('div');
      buttonAppAdmin.id = 'buttonAppAdmin';
      buttonAppAdmin.className = 'buttonAppAdmin';
      buttonAppAdmin.href = '/AppAdmin';
      buttonAppAdmin.textContent = "Page d'administration";
      linkAppAdmin.appendChild(buttonAppAdmin);
      subcontainerOfficier.appendChild(linkAppAdmin);
      subContainer.appendChild(subcontainerOfficier)
    }
    Container.appendChild(subContainer);

  } else {
    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/';
  }
}