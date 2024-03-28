import { adressAPI } from "./home.js";
import { cookieName } from "./main.js";
import { communBlock, createHTMLElement } from "./useful.js";

export function stat() {
    if (!document.cookie.split(";").some((item) => item.trim().startsWith(cookieName + "="))) {
        window.location.href = '/';
    }
    fetch(adressAPI + 'statGvG')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur de réseau: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // console.log('Data received (stat):', data);
            containerviewGroup(data);
        })
        .catch(error => {
            console.error('Data recovery error:', error);
        });
}

function containerviewGroup(data) {
    if (data.Gestion.Logged && data.Gestion.Officier) {
        communBlock(data);

        let subContainerStat = createHTMLElement('div', 'subContainerStat');

        let filter = createHTMLElement('div', 'statfilter');
        filter.textContent = 'filtre de trie ici';
        subContainerStat.appendChild(filter);

        // création des en-tête
        let titledivstat = document.createElement('div');
        titledivstat.classList.add('divTitleStat');
        titledivstat.classList.add('divstat');

        let titleconnected = createHTMLElement('div', 'statconnected');
        titleconnected.textContent = '';
        titledivstat.appendChild(titleconnected);

        let titlename = createHTMLElement('div', 'statname');
        titlename.textContent = 'Pseudo joueur';
        titledivstat.appendChild(titlename);

        let titleclass = createHTMLElement('div', 'statclass');
        titleclass.textContent = 'classe joué';
        titledivstat.appendChild(titleclass);

        let titleinfluenceplayer = createHTMLElement('div', 'statinfluence');
        titleinfluenceplayer.textContent = 'influence joueur';
        titledivstat.appendChild(titleinfluenceplayer);

        let titlelvlplayer = createHTMLElement('div', 'statlvl');
        titlelvlplayer.textContent = 'Level joueur';
        titledivstat.appendChild(titlelvlplayer);

        let titlenbGvGparticiped = createHTMLElement('div', 'statnbgvg');
        titlenbGvGparticiped.textContent = 'GvG participé/total';
        titledivstat.appendChild(titlenbGvGparticiped);

        let titlelastGvGparticiped = createHTMLElement('div', 'statlastgvg');
        titlelastGvGparticiped.textContent = 'Derniére GvG participé le';
        titledivstat.appendChild(titlelastGvGparticiped);

        subContainerStat.appendChild(titledivstat);

        for (let i = 0; i < data.ListInscripted.length; i++) {
            const currentUser = data.ListInscripted[i];

            let divstat = createHTMLElement('div', 'divstat');
            let connected = createHTMLElement('div', 'connected');
            if (currentUser.ID == 1) {
                connected.textContent = '✅';
            } else {
                connected.textContent = '❌';
            }
            divstat.appendChild(connected);

            let name = createHTMLElement('div', 'statname');
            name.textContent = currentUser.Username;
            divstat.appendChild(name);

            let classPlayer = createHTMLElement('div', 'statclass');
            classPlayer.textContent = currentUser.GameCharacter;
            divstat.appendChild(classPlayer);

            let influenceplayer = createHTMLElement('div', 'statinfluence');
            influenceplayer.textContent = currentUser.Influence;
            divstat.appendChild(influenceplayer);

            let lvlplayer = createHTMLElement('div', 'statlvl');
            lvlplayer.textContent = currentUser.Lvl;
            divstat.appendChild(lvlplayer);

            let nbGvGparticiped = createHTMLElement('div', 'statnbgvg');
            nbGvGparticiped.textContent = currentUser.NbGvGParticiped + ' / ' + currentUser.NbTotalGvG;
            divstat.appendChild(nbGvGparticiped);

            let lastGvGparticiped = createHTMLElement('div', 'statlastgvg');
            lastGvGparticiped.textContent = currentUser.DateLastGvGParticiped;
            divstat.appendChild(lastGvGparticiped);

            subContainerStat.appendChild(divstat);
        }


        document.getElementById('Container').appendChild(subContainerStat);

    } else {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/';
    }
}