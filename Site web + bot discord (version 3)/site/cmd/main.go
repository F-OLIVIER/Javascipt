package main

import (
	handlers "botgvg/handlers"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	port := os.Getenv("PORT")

	// Initialisation de la database
	// data.Createdb()

	flag.Parse()
	// home non connecté
	http.HandleFunc("/", handlers.ServeHome)
	// page de transition de connexion
	http.HandleFunc("/discord", handlers.DiscordHandler)
	http.HandleFunc("/api/discord", handlers.DiscordApiHandler)
	// page utilisateur connecté
	http.HandleFunc("/api/home", handlers.HomeHandler)
	http.HandleFunc("/api/charactercard", handlers.CharacterCardHandler)
	http.HandleFunc("/api/updateCharacterCard", handlers.UpdateCharacterCard)
	http.HandleFunc("/api/caserne", handlers.CaserneHandler)
	http.HandleFunc("/api/majcaserne", handlers.MAJCaserneHandler)
	http.HandleFunc("/api/creategroup", handlers.CreateGroupHandler)
	http.HandleFunc("/api/saveGroupInDB", handlers.SaveGroupInDB)
	http.HandleFunc("/api/CheckAppAdmin", handlers.CheckAppAdmin)
	http.HandleFunc("/api/activateOrNotBot", handlers.ActivateOrNotBot)
	http.HandleFunc("/api/adminitrateBot", handlers.AdminitrateBot)

	// Appel des fichiers annexes
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("./public/css/"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("./public/js/"))))
	http.Handle("/img/", http.StripPrefix("/img/", http.FileServer(http.Dir("./public/images/"))))

	// mise en écoute du serveur
	fmt.Println("Server started on port " + port + "\nhttp://localhost:" + port)
	http.ListenAndServe(":"+port, nil)
}
