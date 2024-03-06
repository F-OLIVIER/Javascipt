export function communBlock(data) {
    let userConected = document.getElementById('user');
    let divimguserConected = document.createElement('div');
    let imguserConected = document.createElement('img');
    imguserConected.src = data.UserInfo.Photo;
    divimguserConected.className = 'userImg';
    divimguserConected.appendChild(imguserConected)
    userConected.appendChild(divimguserConected);
    
    let disconnect = document.getElementById('disconnect');
    let Username = document.createElement('div');
    Username.textContent = 'Connecté en tant que ' + data.UserInfo.Username;
    Username.className = 'Username';
    disconnect.appendChild(Username);

    let button = document.createElement('button');
    button.id = 'DisconnectButton';
    button.className = 'DisconnectButton';
    button.type = 'submit';
    button.textContent = 'Se déconnecter';
    disconnect.appendChild(button)

    DisconnectedButton();
}

export function msgError(data) {
    let divError = document.getElementById('error');
    if (data.MsgErr !== "") {
        divError.innerHTML = data.MsgErr;
        divError.style.display = "block";
    } else {
        divError.style.display = "none";
    }
}

export function notFound() {
    let divError = document.getElementById('error');
    divError.textContent = "Erreur 404 : Page not Found";
    divError.style.color = 'red';
    divError.style.display = "block";
}

let timerThrottlebutton = 0;
function DisconnectedButton() {
    var DisconnectedButton = document.getElementById("DisconnectButton");

    // Fonction gestionnaire d'événements
    function DisconnectedButtonClick() {
        const now = new Date();
        if (now - timerThrottlebutton > 500) {
            timerThrottlebutton = now;
            document.cookie = "user_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = '/';
        }
    }
    DisconnectedButton.addEventListener('click', DisconnectedButtonClick);
}