import { cookieName } from "./main.js";
import { communBlock, createHTMLElement } from "./useful.js";

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
      // console.log('Data received (home):', data);
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
    let subContainer = createHTMLElement('div', 'subContainer');
    let linkCharacterCard = createHTMLElement('a', 'no-style-link');
    linkCharacterCard.href = '/characterCard';
    let buttoncharacterCard = createHTMLElement('div', 'buttoncharacterCard');
    buttoncharacterCard.textContent = 'Ma fiche personnage';
    linkCharacterCard.appendChild(buttoncharacterCard);
    subContainer.appendChild(linkCharacterCard);

    // page caserne
    let linkCaserne = createHTMLElement('a', 'no-style-link');
    linkCaserne.href = '/caserne';
    let buttonCaserne = createHTMLElement('div', 'buttonCaserne');
    buttonCaserne.textContent = 'Modifier ma caserne';
    linkCaserne.appendChild(buttonCaserne);
    subContainer.appendChild(linkCaserne);

    if (data.Gestion.Officier) { // si officier, affichage bouton création des groupes et bouton administration
      let subcontainerOfficier = createHTMLElement('div', 'subcontainerOfficier');
      let titlesubcontainerOfficier = createHTMLElement('div', 'titlesubcontainerOfficier');
      titlesubcontainerOfficier.textContent = "Réservé aux officiers";
      subcontainerOfficier.appendChild(titlesubcontainerOfficier);

      // page création des groupes gvg
      let linkCreateGroup = createHTMLElement('a', 'no-style-link');
      linkCreateGroup.href = '/creategroup';
      let buttonCreateGroup = createHTMLElement('div', 'buttonCreateGroup');
      buttonCreateGroup.href = '/creategroup';
      buttonCreateGroup.textContent = 'Créer les groupes GvG';
      linkCreateGroup.appendChild(buttonCreateGroup);
      subcontainerOfficier.appendChild(linkCreateGroup);

      // page des statistiques
      let linkStat = createHTMLElement('a', 'no-style-link');
      linkStat.href = '/stat';
      let buttonStat = createHTMLElement('div', 'buttonStat');
      buttonStat.textContent = 'Statistique';
      linkStat.appendChild(buttonStat);
      subcontainerOfficier.appendChild(linkStat);

      // page d'administration
      let linkAppAdmin = createHTMLElement('a', 'no-style-link');
      linkAppAdmin.href = '/AppAdmin';
      let buttonAppAdmin = createHTMLElement('div', 'buttonAppAdmin');
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