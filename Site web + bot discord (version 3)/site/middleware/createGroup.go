package utils

import (
	data "botgvg/internal"
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
)

func SaveCreateGroup(r *http.Request, database *sql.DB) {
	var listGroup data.SaveGroup
	err := json.NewDecoder(r.Body).Decode(&listGroup)
	CheckErr("Erreur de décodage JSON SaveCreateGroup", err)

	stmt1, errdb := database.Prepare("DELETE FROM GroupGvG")
	CheckErr("1- DELETE - Requete DB SaveCreateGroup", errdb)
	stmt1.Exec()

	for i := 1; i < len(listGroup.ListGroup); i++ {
		currentline := listGroup.ListGroup[i]
		currentLength := len(currentline.UserToSave)
		if currentLength > 1 {
			var unit1, unit2, unit3, unit4 string
			if currentLength == 5 {
				unit1 = currentline.UserToSave[1]
				unit2 = currentline.UserToSave[2]
				unit3 = currentline.UserToSave[3]
				unit4 = currentline.UserToSave[4]
			} else if currentLength == 4 {
				unit1 = currentline.UserToSave[1]
				unit2 = currentline.UserToSave[2]
				unit3 = currentline.UserToSave[3]
				unit4 = ""
			} else if currentLength == 3 {
				unit1 = currentline.UserToSave[1]
				unit2 = currentline.UserToSave[2]
				unit3 = ""
				unit4 = ""
			} else if currentLength == 2 {
				unit1 = currentline.UserToSave[1]
				unit2 = ""
				unit3 = ""
				unit4 = ""
			} else if currentLength == 1 {
				unit1 = ""
				unit2 = ""
				unit3 = ""
				unit4 = ""
			}

			username_ID := 0
			stmtUsers, errdb := database.Prepare("SELECT ID FROM Users WHERE DiscordName = ?")
			CheckErr("1- Requete DB SaveCreateGroup", errdb)
			stmtUsers.QueryRow(currentline.UserToSave[0]).Scan(&username_ID)

			if username_ID != 0 {
				groupNumber := strings.Replace(currentline.NameGroup, "group", "", 1)
				stmt2, errdb := database.Prepare("INSERT INTO GroupGvG (User_ID,GroupNumber,Unit1,Unit2,Unit3,Unit4) Values(?,?,?,?,?,?)")
				CheckErr("2- INSERT - Requete DB SaveCreateGroup", errdb)
				stmt2.Exec(username_ID, groupNumber, unit1, unit2, unit3, unit4)

			}
		}
	}
}
