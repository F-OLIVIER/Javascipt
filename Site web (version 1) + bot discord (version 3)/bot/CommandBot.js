// Fichier annexe
import { client, Messagenb, Messagelist, Messageclassok, Messageclass, Messageclassfaux } from './Constant.js';
import { msgreactgvg } from './Reaction.js';
import sqlite3 from 'sqlite3';

// Module nodejs et npm
import moment from 'moment-timezone';
import { } from 'dotenv/config';

// Commande nb
export async function cmdnb(AuthorID, BotChanOfficier) {
  const db = new sqlite3.Database('../database/databaseGvG.db');
  const requestQueries = [
    `SELECT COUNT(*) AS NumberOfResponses FROM Users WHERE EtatInscription = 1;`,
    `SELECT COUNT(*) AS NumberOfResponses FROM Users WHERE EtatInscription = 2;`,
    `SELECT COUNT(*) AS NumberOfResponses FROM Users WHERE EtatInscription = 3;`,
  ];

  try {
    const responseCounts = await Promise.all(
      requestQueries.map(query => {
        return new Promise((resolve, reject) => {
          db.get(query, [], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row.NumberOfResponses);
            }
          });
        });
      })
    );

    console.log(responseCounts);
    const nb_inscrit = responseCounts[0] + responseCounts[1] + responseCounts[2];
    Messagenb(AuthorID, BotChanOfficier, nb_inscrit, responseCounts[0], responseCounts[1], responseCounts[2]);
  } catch (err) {
    console.error(err);
  } finally {
    db.close();
  }
}

// command list
export async function cmdlist(AuthorID, BotChanOfficier) {
  const db = new sqlite3.Database('../database/databaseGvG.db');
  const requestQueries = [
    `SELECT DiscordID FROM Users WHERE EtatInscription = 1;`,
    `SELECT DiscordID FROM Users WHERE EtatInscription = 2;`,
    `SELECT DiscordID FROM Users WHERE EtatInscription = 3;`,
  ];

  const playerLists = await Promise.all(
    requestQueries.map(query => {
      return new Promise((resolve, reject) => {
        db.all(query, [], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            console.log("row : ", rows)
            resolve(rows.map(row => row.DiscordID));
          }
        });
      });
    })
  );
  db.close();

  const nb_present = playerLists[0].length; // NextRaid = 1
  const nb_retard = playerLists[1].length; //  NextRaid = 2
  const nb_absent = playerLists[2].length; //  NextRaid = 3

  var list_present; // NextRaid = 1
  var list_retard; //  NextRaid = 2
  var list_absent; //  NextRaid = 3

  // List present
  if (nb_present == 0) {
    list_present = ":sob: Aucun joueur inscrit :sob:";
  }
  else if (nb_present != 0) {
    list_present = "**" + nb_present + " joueurs :**";
    for (let i = 0; i < nb_present; i++) {
      list_present += " :white_check_mark:<@" + playerLists[0][i] + ">";
      if (i != nb_present) {
        list_present += ", ";
      }
    }
  }
  // List en retard
  if (nb_retard == 0) {
    list_retard = ":partying_face: Aucun joueur en retard :partying_face:";
  }
  else if (nb_retard != 0) {
    list_retard = "**" + nb_retard + " joueurs :**";
    for (let i = 0; i < nb_retard; i++) {
      list_retard += " :clock2:<@" + playerLists[1][i] + ">";
      if (i != nb_retard) {
        list_retard += ", ";
      }
    }
  }
  // List absent
  if (nb_absent == 0) {
    list_absent = ":heart_eyes: Aucun joueur absent :heart_eyes:";
  }
  else if (nb_absent != 0) {
    list_absent = "**" + nb_absent + " joueurs :**"
    for (let i = 0; i < nb_absent; i++) {
      list_absent += " :x:<@" + playerLists[2][i] + ">";
      if (i != nb_absent) {
        list_absent += ", ";
      }
    }
  }
  Messagelist(AuthorID, BotChanOfficier, list_present, list_retard, list_absent);
}

// Command class
export function cmdclass(AuthorID, ClassSaisie, BotChan) {
  let MemberGameCharacter = "" // temp.GameCharacter;
  let GameCharacter_ID = 0;

  if (ClassSaisie == "arc" || ClassSaisie == "sar" || ClassSaisie == "ARC" || ClassSaisie == "SAR" || ClassSaisie == "Arccourt" || ClassSaisie == "Shortarch") {
    MemberGameCharacter = "Arc court / Short arch";
    GameCharacter_ID = 1;
  }
  else if (ClassSaisie == "acl" || ClassSaisie == "lar" || ClassSaisie == "ACL" || ClassSaisie == "LAR" || ClassSaisie == "Arclong" || ClassSaisie == "Longarc") {
    MemberGameCharacter = "Arc long / Long arc";
    GameCharacter_ID = 2;
  }
  else if (ClassSaisie == "lju" || ClassSaisie == "tbl" || ClassSaisie == "LJU" || ClassSaisie == "TBL" || ClassSaisie == "Lamesjumelles" || ClassSaisie == "Twinblades") {
    MemberGameCharacter = "Lames jumelles / Twin blades";
    GameCharacter_ID = 3;
  }
  else if (ClassSaisie == "ecb" || ClassSaisie == "écb" || ClassSaisie == "sss" || ClassSaisie == "ECB" || ClassSaisie == "SSS" || ClassSaisie == "épéecourte" || ClassSaisie == "Epeecourte" || ClassSaisie == "Shortsword") {
    MemberGameCharacter = "épée courte & bouclier / Short sword & shield";
    GameCharacter_ID = 4;
  }
  else if (ClassSaisie == "elb" || ClassSaisie == "élb" || ClassSaisie == "lss" || ClassSaisie == "ELB" || ClassSaisie == "LSS" || ClassSaisie == "épéelongue" || ClassSaisie == "epeelongue" || ClassSaisie == "Longsword") {
    MemberGameCharacter = "épée longue & bouclier / Long sword & shield";
    GameCharacter_ID = 5;
  }
  else if (ClassSaisie == "gua" || ClassSaisie == "guandao") {
    MemberGameCharacter = "Guandao";
    GameCharacter_ID = 6;
  }
  else if (ClassSaisie == "hda" || ClassSaisie == "wax" || ClassSaisie == "HDA" || ClassSaisie == "WAX" || ClassSaisie == "Hache" || ClassSaisie == "Weaponax") {
    MemberGameCharacter = "Hache d'arme / Weapon ax";
    GameCharacter_ID = 7;
  }
  else if (ClassSaisie == "lan" || ClassSaisie == "spe" || ClassSaisie == "LAN" || ClassSaisie == "SPE" || ClassSaisie == "Lance" || ClassSaisie == "spear") {
    MemberGameCharacter = "Lance / spear";
    GameCharacter_ID = 8;
  }
  else if (ClassSaisie == "mou" || ClassSaisie == "mus" || ClassSaisie == "MOU" || ClassSaisie == "MUS" || ClassSaisie == "Mousquet" || ClassSaisie == "Musket") {
    MemberGameCharacter = "Mousquet / Musket";
    GameCharacter_ID = 9;
  }
  else if (ClassSaisie == "nod" || ClassSaisie == "NOD" || ClassSaisie == "Nodashi") {
    MemberGameCharacter = "Nodashi";
    GameCharacter_ID = 10;
  }
  else if (ClassSaisie == "mas" || ClassSaisie == "MAS" || ClassSaisie == "Masse" || ClassSaisie == "Mass") {
    MemberGameCharacter = "Masse de guerre / Mass of war";
    GameCharacter_ID = 11;
  }
  else if (ClassSaisie == "dac" || ClassSaisie == "dàc" || ClassSaisie == "chb" || ClassSaisie == "DAC" || ClassSaisie == "CHB" || ClassSaisie == "Dague" || ClassSaisie == "dart") {
    MemberGameCharacter = "Dague à chaine / Chain dart";
    GameCharacter_ID = 12;
  }
  else if (ClassSaisie == "piq" || ClassSaisie == "pik" || ClassSaisie == "PIQ" || ClassSaisie == "PIK" || ClassSaisie == "Pique" || ClassSaisie == "Pike") {
    MemberGameCharacter = "Pique / Pike";
    GameCharacter_ID = 13;
  }

  if (GameCharacter_ID !== 0) {
    const db = new sqlite3.Database('../database/databaseGvG.db');
    const updateQuery = `UPDATE Users SET GameCharacter_ID = ? WHERE DiscordID = ?;`;
    db.run(updateQuery, [GameCharacter_ID, AuthorID],
      function (error) {
        if (error) throw error;
      }
    );
    db.close();

    Messageclassok(AuthorID, BotChan, MemberGameCharacter);
  } else if (ClassSaisie == "") {
    Messageclass(AuthorID, BotChan);
  } else {
    Messageclassfaux(AuthorID, BotChan);
  }
}

// command resetmsggvg
export async function cmdresetmsggvg(BotReaction, TODOBotReaction) {
  const db = new sqlite3.Database('../database/databaseGvG.db');
  const updateQuery = `SELECT IDMessageGvG FROM GestionBot WHERE ID = 1;`;
  const getIdMsg = () => {
    return new Promise((resolve, reject) => {
      db.get(updateQuery, [], (err, row) => {
        if (err) {
          reject(err);
        } else {
          const id_msg = row ? row.IDMessageGvG : null;
          resolve(id_msg);
        }
      });
    });
  };
  const id_msg = await getIdMsg();
  db.close();

  // suppression du précédent message d'inscription
  client.channels.cache.get(TODOBotReaction).messages.fetch(id_msg).then(message => message.delete());

  // gestion de la date futur pour le message
  var now = moment();
  var day = now.day(); // 0 dimanche, 1 lundi, 2 mardi, 3 mercredi, 4 jeudi, 5 vendredi, 6 samedi

  var futurdate;
  if (day == 0) { // si dimanche (jour 0), gvg le mardi
    futurdate = moment().add(2, 'days');
  } else if (day == 1) { // si lundi (jour 1), gvg le mardi
    futurdate = moment().add(1, 'days');
  } else if (day == 2) { // si mardi (jour 2), gvg le samedi
    futurdate = moment().add(4, 'days');
  } else if (day == 3) { // si mercredi (jour 3), gvg le samedi
    futurdate = moment().add(3, 'days');
  } else if (day == 4) { // si jeudi (jour 4), gvg le samedi
    futurdate = moment().add(2, 'days');
  } else if (day == 5) { // si vendredi (jour 5), gvg le samedi
    futurdate = moment().add(1, 'days');
  } else if (day == 6) { // si samedi (jour 6), gvg le mardi
    futurdate = moment().add(3, 'days');
  }

  // génére la date au bon format
  const futurdateformate = new Date(futurdate + (moment().tz("Europe/Paris").utcOffset()));
  // récupération du jour, de la date et du mois
  var jour = futurdateformate.getDay();
  var date = futurdateformate.getDate();
  var mois = futurdateformate.getMonth();
  msgreactgvg(BotReaction, jour, mois, date);
}
