import { home } from "./home.js";
import { caserne } from "./caserne.js";
import { creategroup } from "./creategroup.js";
import { characterCard } from "./characterCard.js";
import { administration } from "./administration.js";
import { viewgroup } from "./viewGroup.js";
import { stat } from "./stat.js";
import { createHTMLElement } from "./useful.js";
export const cookieName = "user_token";

let path = window.location.pathname;
switch (path) {
    case '/':
        if (document.cookie.split(";").some((item) => item.trim().startsWith(cookieName + "="))) {
            window.location.href = '/home';
        } else {
            homeNotConnected();
        }
        break;

    case '/discord':
        // page géré de façon externe
        break;

    case '/home':
        home();
        break;

    case '/caserne':
        caserne();
        break;

    case '/creategroup':
        creategroup();
        break;

    case '/viewGroup':
        viewgroup();
        break;

    case '/characterCard':
        characterCard();
        break;

    case '/AppAdmin':
        administration();
        break;

    case '/stat':
        stat();
        break;

    default:
        window.location.href = '/';
        break;
}

function homeNotConnected() {
    let Container = document.getElementById('Container');

    let link = createHTMLElement('a', 'linkDiscord');
    link.href = "https://discord.com/api/oauth2/authorize?client_id=1203301786254057534&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A53134%2Fdiscord&scope=identify";

    let discordConnect = createHTMLElement('div', 'discordConnect');
    let divlink = createHTMLElement('div', 'divlink');
    
    divlink.textContent = "Cliquer pour vous connecter avec discord";
    discordConnect.appendChild(divlink)

    let divimg = document.createElement('div');
    let imgDiscord = document.createElement('img');
    imgDiscord.src = "img/Logo_Discord.png";
    divimg.appendChild(imgDiscord);
    discordConnect.appendChild(divimg);

    link.appendChild(discordConnect);
    Container.appendChild(link);
}