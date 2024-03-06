package utils

import (
	data "botgvg/internal"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gofrs/uuid"
)

var Sessions = map[string]Session{}

type Session struct {
	DiscordId string
	Cookie    *http.Cookie
}

func CheckUser(w http.ResponseWriter, r *http.Request, database *sql.DB) bool {
	// Récupération des informations du post
	var discordUser data.DiscordUser
	err := json.NewDecoder(r.Body).Decode(&discordUser)
	CheckErr("Erreur de décodage JSON CheckUser", err)
	if discordUser.Id != "" {
		var ID, connectedSite string
		stmt, err := database.Prepare("SELECT ID, ConnectedSite FROM Users WHERE DiscordID = ?")
		CheckErr("db Prepare CheckUser : ", err)
		err1 := stmt.QueryRow(discordUser.Id).Scan(&ID, &connectedSite)

		CheckErr("QueryRow CheckUser : ", err1)
		if err1 == nil {
			userUUID := uuid.Must(uuid.NewV4())
			uuid := userUUID.String()
			cookie := &http.Cookie{
				Name:    "user_token",
				Value:   uuid,
				Expires: time.Now().Add(6 * time.Hour),
				Path:    "/",
				Secure:  true,
			}
			SessionLogger(w, r, ID, discordUser.Id, cookie, database)
			if connectedSite == "0" {
				newuser, errdb := database.Prepare("INSERT INTO Caserne (User_ID) Values(?)")
				CheckErr("Requete DB newuser in caserne in CheckUser", errdb)
				newuser.Exec(ID)
			}
			return true
		}
	}
	return false
}

// Fonction qui crée le cookie et sa correspondance dans la db ainsi que dans la map
func SessionLogger(w http.ResponseWriter, r *http.Request, IdDB, discordId string, cookie *http.Cookie, database *sql.DB) {
	Sessions[IdDB] = Session{
		DiscordId: discordId,
		Cookie:    cookie,
	}
	stmt, err := database.Prepare("UPDATE Users SET uuid = ?, ConnectedSite = ? WHERE DiscordID = ?")
	CheckErr("sessionlogger (SessionLogger): ", err)
	stmt.Exec(cookie.Value, 1, discordId)
	http.SetCookie(w, cookie)
	// fmt.Println(Sessions)
}

// Fonction qui compare le cookie utilisateur avec la map de gestion des cookies
func CheckToken(s map[string]Session, c *http.Cookie) bool {
	for _, v := range s {
		if v.Cookie.Value == c.Value {
			return true
		}
	}
	return false
}

// Fonction de déconnexion (supression du cookie) et suppression de l'uuid dans la db
func Logout(w http.ResponseWriter, r *http.Request, database *sql.DB) {
	c, err := r.Cookie("user_token")
	if err == http.ErrNoCookie {
		http.Redirect(w, r, "/", http.StatusSeeOther)
	}
	CheckErr("logout : ", err)
	stmt, err := database.Prepare("UPDATE Users SET uuid = NULL WHERE uuid = ?")
	CheckErr("logout :", err)
	stmt.Exec(c.Value)
	delete(Sessions, c.Value)
	c.MaxAge = -1
	http.SetCookie(w, c)
	fmt.Println("Logged out successfully")
	// http.Redirect(w, r, "/?session=disconnected", http.StatusSeeOther)
}
