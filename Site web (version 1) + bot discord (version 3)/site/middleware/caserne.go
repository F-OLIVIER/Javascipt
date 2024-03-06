package utils

import (
	data "botgvg/internal"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

func ListAllUnit(database *sql.DB) (ListUnit []data.Unit) {
	listUnit, err := database.Prepare("SELECT ID, Unit, InfuenceMax, LvlMax, TypeUnit, ForceUnit, Img FROM ListUnit")
	CheckErr("1- Requete DB fonction Caserne", err)
	rows, err := listUnit.Query()
	CheckErr("2- Requete DB fonction Caserne", err)
	for rows.Next() {
		var unit data.Unit
		err = rows.Scan(&unit.ID, &unit.Name, &unit.Influence, &unit.LvlMax, &unit.Type, &unit.Tier, &unit.Img)
		CheckErr("3- Requete DB fonction Caserne", err)
		ListUnit = append(ListUnit, unit)
	}
	return ListUnit
}

func CaserneUser(userID string, database *sql.DB) (ListUnit []data.Unit) {
	ListUnit = ListAllUnit(database)

	userUnit, err := database.Prepare("SELECT * FROM Caserne WHERE User_ID = ?")
	CheckErr("1- Requete DB fonction CaserneUser", err)
	row, err := userUnit.Query(userID)
	CheckErr("2- Requete DB fonction CaserneUser", err)
	// récupération du nom des colonnes
	columns, err := row.Columns()
	CheckErr("3- Requete DB fonction CaserneUser", err)
	// Créez un tableau pour stocker les valeurs des colonnes
	values := make([]interface{}, len(columns))
	for i := range values {
		values[i] = new(interface{})
	}

	// Scannez les valeurs des colonnes dans le tableau values
	for row.Next() {
		err = row.Scan(values...)
		CheckErr("4- Requete DB fonction CaserneUser", err)

		// transformation de l'array d'interface en array de string
		stringValues := make([]string, len(values))
		for i, v := range values {
			switch val := (*v.(*interface{})).(type) {
			case string:
				stringValues[i] = val
			case []byte:
				stringValues[i] = string(val)
			// Ajoutez d'autres cas si nécessaire pour d'autres types
			default:
				stringValues[i] = fmt.Sprintf("%v", val)
			}
		}

		for i_columns, col := range columns {
			for i_ListUnit, unit := range ListUnit {
				if col == "Unit"+unit.ID {
					ListUnit[i_ListUnit].Lvl = stringValues[i_columns]
					break
				}
			}
		}
	}

	return ListUnit
}

func MAJCaserne(r *http.Request, userID string, database *sql.DB) {
	var newCaserne data.ChangeUnitCaserne
	err := json.NewDecoder(r.Body).Decode(&newCaserne)
	CheckErr("Erreur de décodage JSON MAJCaserne", err)

	var setConditions []string     // Liste des colonnes à set
	var updateValues []interface{} // Liste des valeurs des colonnes

	for _, unit := range newCaserne.NewLvlUnitCaserne {
		if unit[1] != "" && strings.Contains(unit[0], "Unit") {
			if unit[1] != "-1" { // Mise à jour du level de l'unité
				setConditions = append(setConditions, unit[0]+" = ?") // Liste des colonnes à set
				updateValues = append(updateValues, unit[1])          // Liste des valeurs des colonnes
			} else { // Suppression de l'unité
				setConditions = append(setConditions, unit[0]+" = ?") // Liste des colonnes à set
				updateValues = append(updateValues, "")               // Liste des valeurs des colonnes
			}
		}
	}

	if len(setConditions) > 0 {
		query := "UPDATE Caserne SET " + strings.Join(setConditions, ", ") + " WHERE User_ID = ?"
		stmt, err := database.Prepare(query)
		CheckErr("Requete db MAJCaserne :", err)
		updateValues = append(updateValues, userID)
		stmt.Exec(updateValues...)
	}
}
