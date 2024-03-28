import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { userInfo, classPlay } from './database.js';

export const client = new
  Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [
      Partials.Message,
      Partials.Reaction,
      Partials.User
    ]
  });

// --------------------------------------
// ------------- Adaptation -------------
// --------------------------------------

// id du serveur
export const ServerID = '674215425546125323'; // serveur de test
// id des roles discord non autorisé (bot, etc.)
export const DiscordUnauthorizedRole = ["1061582256214388738", "736881259560829009", "1070078308244521072"];
// ligne 63 : List des admins
// ligne 76 : Utilisateur autorisé pour les commandes !mp et !raid on/off
// Nom du groupe a cité (message reset raid)
var group = "everyone";

// -------------------------------------
// ----------- Coeur du code -----------
// -------------------------------------

// Gestion des admins du bot
export function BooleanAdmin(DiscordPlayerID) {
  // TODO: List des admins du bot
  var ListAdmin = ["179655652153491456"]; // coincoin
  for (var CurrentAdmin = 0; CurrentAdmin < ListAdmin.length; CurrentAdmin++) {
    if (ListAdmin[CurrentAdmin] == DiscordPlayerID) {
      return true;
    }
  }
  return false;
}

// Gestion des utilisateur autorisé pour les commandes !mp et raid on/off
export function Booleanusermp(DiscordPlayerID) {
  // TODO : Utilisateur autorisé pour les commandes !mp et !raid on/off
  let Listusermp = ["179655652153491456", "489520129705771029", "256509244277391360", "154670779236220928", "274945457707286528", "438019087457583124", "828641205881012294", "166151581325066240", "328164062712299522", "166151485154000896", "1081374865501724732"];
  // coincoin, akyol, master, rafu, Allyta, Berchoun, OGM, fish, RC, Crashow, Maeecko
  let usermp = false;

  for (var Currentusermp = 0; Currentusermp < Listusermp.length; Currentusermp++) {
    if (Listusermp[Currentusermp] == DiscordPlayerID) {
      usermp = true;
    }
  }
  return usermp;
}

export function MessageInsufficientAuthority(AuthorID, BotChan) {
  BotChan.send({
    content: "<@" + AuthorID + "> \n",
    files: ["https://i.servimg.com/u/f43/15/76/70/95/admin10.png"],
    ephemeral: true,
  });
}

// Message chan officier
export function Messagegvg(AuthorID, BotChanOfficier, listnoninscrit) {
  BotChanOfficier.send("<@" + AuthorID + ">\nJoueur n'ayant pas indiqué leurs présence pour la prochaine GvG :\n" + listnoninscrit);
}

export function Messagenb(AuthorID, BotChanOfficier, nb_inscrit, nb_present, nb_retard, nb_absent) {
  BotChanOfficier.send("<@" + AuthorID + ">\nVoici les statistiques d'inscription pour la prochaine GvG : \n Nombre de joueur **inscrit** : " + nb_inscrit + " \n Nombre de joueur **present** : " + nb_present + "\n Nombre de joueur **absent** : " + nb_absent);
}

export function Messagelist(AuthorID, BotChanOfficier, list_present, list_retard, list_absent) {
  BotChanOfficier.send("<@" + AuthorID + ">\nVoici les listes pour la prochaine GvG : \n\n__Liste des joueurs **presents**__ : \n" + list_present + "\n\n__Liste des joueurs **absent**__ :\n" + list_absent);
}

export function Messageprivatemp(AuthorID, BotChanOfficier, userpourmp) {
  BotChanOfficier.send("<@" + AuthorID + ">\nLe message de rappel d'incription à la prochaine GvG à bien été envoyé en mp à : <@" + userpourmp + ">");
}
// Private message de rappel
export function privatemp(privatemessage, changvg, utilisateurofficier) {
  privatemessage.send("Bonjour,\nCeci est message de rappel d'inscription à la prochaine GvG\nMerci de t'inscrire sur le bot GvG dans le chan <#" + changvg + ">. Si tu ne sais pas comment faire : écrit !info dans le chan.\nPour répondre a ce message, ne pas répondre directement mais contacter un officier : <@" + utilisateurofficier + "> par exemple.\nA bientôt et bon jeu");
}

// Embled DATA
export async function EmbedGuide() {

  let link1 = "[Le guide des guides / Guide to guides](https://conqblade.com/news/460)";
  let link2 = "[Bien commencer dans le jeu / Getting started in the game](https://conqblade.com/fr/news/538)";

  let linkFR = "Guide et calculateur en Fran�ais / French guide and calculator :";
  let linkFR1 = "[Conqueror's Blade - Caracteteristique heros et unites](https://drive.google.com/file/d/1g4vRkolXGbCKJVP3yk95u7AYdMS8yReL)";
  let linkFR2 = "[Conqueror's Blade - Artisanat](https://docs.google.com/spreadsheets/d/1WFi3G6ABFnwbTDQmeW2knrs99g3qF8PPzXpTk2vya6Q)";
  let linkFR3 = "[Guide des Quetes de Fiefs](https://docs.google.com/document/d/1Xu5TTSMOVv3AfecrL5VRPWmy0EQv8NGeFs4KhiPt8yQ )";
  let linkFR4 = "[Guide de craft et ressources ](https://docs.google.com/document/d/19PrHGN2aHaZNeL-gtWR8sXCJEvmypPkNg5eJr2HB8UM)";

  let linkEN = "Guide et calculateur en anglais / English guide and calculator :";
  let linkEN1 = "[Comprehensive Guide to Fief Quests ](http://universalgamersfederation.com/2019/08/16/conquerors-blade-comprehensive-guide-to-fief-quests)";
  let linkEN2 = "[Gathering and Crafting Unit Kits for New Players ](https://www.gaisciochmagazine.com/articles/conquerors_blade__gathering_and_crafting_unit_kits_for_new_players.html)";
  let linkEN3 = "[Zimster's Conquerors Blade Guide ](https://docs.google.com/spreadsheets/d/1C-XPnZuCtYxRaNdjzDSj9kFqngPuZyO4WGVt8agFf5M)";
  let linkEN4 = "[Crafting calculators with kits & materials database](https://docs.google.com/spreadsheets/d/1XHVHVkjGTmhUMBoxscQ-m4MFtKEdpFXn-IFECfZIAVk)";
  let linkEN5 = "[OmniPower's CB Crafting/Gathering Guide](https://docs.google.com/spreadsheets/d/12m_jD9tyVGXX36NXsLdcskv0MpQ5HSaOTkVRP6cB1fA)";
  let linkEN6 = "[How to CB for Tyrants 3](https://docs.google.com/spreadsheets/d/1OJl6h27tB4VAng_SE0sJ4WOhcp257AbQO_ZqsgNrQA0)";

  const EmbedGuide = {
    color: 0x0099ff,
    title: "**---------------------------------------\n   Conqueror's Blade\n   Liste de guide et calculateur\n   Guide list and calculator\n ---------------------------------------**",
    thumbnail: {
      url: 'https://i43.servimg.com/u/f43/15/76/70/95/image-11.png',
    },
    fields: [
      {
        "name": "Guide officiel / Official guide :",
        "value": "1 - " + link1 + "\n2 - " + link2,
      },
      {
        "name": linkFR,
        "value": "1 - " + linkFR1 + "\n2 - " + linkFR2 + "\n3 - " + linkFR3 + "\n4 - " + linkFR4,
      },
      {
        "name": linkEN,
        "value": "1 - " + linkEN1 + "\n2 - " + linkEN2 + "\n3 - " + linkEN3 + "\n4 - " + linkEN4 + "\n5 - " + linkEN5 + "\n6 - " + linkEN6,
      },
    ],
    footer: {
      text: 'Des guides a ajouter ? Dite le a votre maitre de guilde\nGuides to add ? Tell your guild master\n',
      icon_url: 'https://i43.servimg.com/u/f43/15/76/70/95/_guide10.png',
    },
  };

  return EmbedGuide
}

export async function EmbedData(interaction) {
  let CurrentPlayer = await userInfo(interaction.user.id);
  // console.log("CurrentPlayer : ", CurrentPlayer);
  let PPLPR = "Aucune donnée";
  let lvlhero = "Aucune donnée";
  let role = "";
  let markp = "";
  let PP = 0;
  if (CurrentPlayer.NbGvGParticiped != 0) {
    PP = Math.round(CurrentPlayer.NbGvGParticiped / CurrentPlayer.NbTotalGvG * 100);
  }

  if (CurrentPlayer.Lvl == 0) {
    lvlhero = "non defini - undefined \nutilise !lvl pour le definir \n use !lvl to define it";
  } else {
    lvlhero = CurrentPlayer.Lvl;
  }

  let classe = "non defini - undefined \nutilise !class pour le definir \n use !class to define it"
  if (CurrentPlayer.GameCharacter_ID != 0) {
    classe = await classPlay(CurrentPlayer.GameCharacter_ID);
  }

  if (CurrentPlayer.DiscordRole == "Erreur") {
    role = "Pas de rôle discord attribue\nNo discord role assigned ";
  } else {
    role = CurrentPlayer.DiscordRole;
  };


  if (CurrentPlayer.EtatInscription == 1) {
    PPLPR = "Inscrit présent (Présent pour le brefing à 19h30)\nRegistered present (Present for the briefing at 7:30 p.m.)";
    markp = ":white_check_mark:";
  } else if (CurrentPlayer.EtatInscription == 0) {
    PPLPR = ":sob: Non inscrit / not registered :sob:";
  } else if (CurrentPlayer.EtatInscription == 2) {
    PPLPR = "Inscrit en retard : arrivé aprés le début du brefing (19h30)\nRegistered late : arrived after the start of the briefing (7:30 p.m.)";
    markp = ":clock2:";
  } else if (CurrentPlayer.EtatInscription == 3) {
    PPLPR = ":x: Inscrit absent / Registered absent";
  } else {
    PPLPR = "Jamais absent / never Registered";
  }

  const DataEmbed = {
    title: "Joueur / Player : **__" + CurrentPlayer.DiscordName + "__**",
    color: 13373715,
    thumbnail: {
      url: interaction.user.avatarURL()
    },
    fields: [
      {
        name: "Classe joué en GvG /Class played in TW",
        value: classe,
        inline: true
      },
      {
        name: "Niveau du héros / hero's level",
        value: "level : " + lvlhero
      },
      {
        name: "Influence de votre héros / Influence of your hero",
        value: "Influence : " + CurrentPlayer.Influence + "\n(700 + armure / armor)"
      },
      {
        name: markp + " inscription GvG / TW registration",
        value: PPLPR
      },
      {
        name: "Statistique GvG / TW stat",
        value: "GvG participé / TW participated : ***" + CurrentPlayer.NbGvGParticiped + "***" +
          "\n Derniére gvg participé / Last participed GvG : ***" + CurrentPlayer.DateLastGvGParticiped + "***" +
          "\n Presence : ***" + PP + "%***"
      }
    ]
  };

  return DataEmbed
}
