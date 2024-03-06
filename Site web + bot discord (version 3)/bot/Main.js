// Fichier annexe
import { PlayerCreateOrUpdate } from './FuncData.js';
// import { AuthCALL, efface, UpdateNextRaid, Stat } from './FuncGoogleSHEET.js';
// import { Resetsc, Resetac, Resetraz } from './FuncRaid.js';
import { client, Messageinfo, BooleanAdmin, Messagelvlok, Messageinfluok, Messagegvg, privatemp, Messageprivatemp, Messageinfoadmin, MessageInsufficientAuthority, Messagelvl, Booleanusermp, MessageRaidon, MessageRaidoff, EmbedData, EmbedGuide } from './Constant.js';
import { addReaction, removeReaction } from './Reaction.js';
import { cmdnb, cmdlist, cmdclass, cmdresetmsggvg } from "./CommandBot.js";
import { cronCheckpresence, cronResetMsgReaction } from "./Cronjob.js"
import { botOn, updateLvl, updateInflu, updateActivationBot, unregisteredList } from './database.js';

// Module nodejs et npm
import { } from 'dotenv/config';
import { CronJob } from 'cron';
// import delay from 'delay';

// --------------------------------------
// ------------- Adaptation -------------
// --------------------------------------

// id des chan (utilisateur, message reaction, message rappel, chan officier)
var TODOBotChan = '674275684364845057';
var TODOBotReaction = '1111983569900929024';
var TODOBotrappel = '674275684364845057';
var TODOBotChanOfficier = '715893349931810898';
// Role discord
var TODOdiscordrole = "@Officier";
// Chan et utilisateur à cité dans le message privée
var TODOchangvg = '674275684364845057';
var TODOutilisateurofficier = '179655652153491456'; // coincoin
// Utilisateur qui reçois en message privée les sauvegardes automatique de la BDD
var TODOusermpgetsaveBDD = '179655652153491456'; // coincoin
// Catégorie des channels a checker pour les presences pendant la gvg
var idCategorie = '674215425990459413';
// Role a ping dans le message d'inscription GvG
var idrole = '951159160190427137';

// -----------------------------------------------------------
// ---------------------- Coeur du code ----------------------
// -----------------------------------------------------------

client.login(process.env.TOKEN);

client.on('ready', () => {
  // Message de confirmation du demarrage du bot dans la console
  console.log(`\n------------------------------\n----> Bot GvG LNB pret ! <----\n------------------------------\n`);
});

// Afficher les erreurs
client.on('error', console.error);

// --------------------------------------------------------------
// ---------------------- Réaction message ----------------------
// --------------------------------------------------------------

// ajout d'une réaction
client.on("messageReactionAdd", async (reaction, user) => {
  if (user.bot) {
    return;
  }

  if (reaction.message.channel.id == TODOBotReaction && botOn(reaction.message.id)) {
    // Mise a jour du joueur dans la bd
    await PlayerCreateOrUpdate(user.id);
    // Ajout de la réaction
    await addReaction(reaction, user);
  } else {
    return;
  }
});

// Supression d'une réaction
client.on("messageReactionRemove", async (reaction, user) => {
  if (user.bot) {
    return;
  }
  if (reaction.message.channel.id == TODOBotReaction && botOn(reaction.message.id)) {
    // Mise a jour du joueur dans la bd
    await PlayerCreateOrUpdate(user.id);
    // Retrait de la réaction
    await removeReaction(reaction, user);
  } else {
    return;
  }
});

// --------------------------------------------------------------
// ----------------------- Activation bot -----------------------
// --------------------------------------------------------------

// definition des variables
const prefix = '!';
var BotChan;
var BotReaction;
var Botrappel;
var BotChanOfficier;

// definition des chan utilise par le bot
client.on('ready', function () {
  BotChan = client.channels.cache.get(TODOBotChan);
  BotReaction = client.channels.cache.get(TODOBotReaction);
  Botrappel = client.channels.cache.get(TODOBotrappel);
  BotChanOfficier = client.channels.cache.get(TODOBotChanOfficier);
  TaskHandle(BotChan, BotReaction, TODOBotReaction, Botrappel, TODOBotrappel, idrole, TODOusermpgetsaveBDD);
});

// --------------------------------------------------------------
// ---------------------- Commande message ----------------------
// --------------------------------------------------------------

client.on('messageCreate', async message => {
  var MC = message.content.toLowerCase();
  var AuthorID = message.author.id;
  await PlayerCreateOrUpdate(AuthorID);

  // Fonction de test
  // if (MC.startsWith(prefix + "test")){
  //     message.delete();
  // }

  // Définition des canaux ou le bot réagis : canal utilisateur GvG et canal Officier
  if (message.channel.id == TODOBotChan || message.channel.id == TODOBotChanOfficier) {

    // donne les commandes du bot
    if (MC.startsWith(prefix + "info") || MC.startsWith(prefix + "aide")) {
      Messageinfo(AuthorID, BotChan);
    }

    // donne les commande admin du bot
    if (MC.startsWith(prefix + "infoadmin")) {
      if (BooleanAdmin(AuthorID) == true) {
        Messageinfoadmin(AuthorID, BotChan);
      }
      else {
        MessageInsufficientAuthority(AuthorID, BotChan);
      }
    }

    // Commande /nb (donne les presences GvG)
    if (MC.startsWith(prefix + "nb")) {
      cmdnb(AuthorID, BotChanOfficier);
    }

    // Commande /list (donne la liste des presences GvG) 
    if (MC.startsWith(prefix + "list")) {
      cmdlist(AuthorID, BotChanOfficier);
    }

    // Commande /rappel (Affiche un massage de rappel d'inscription)
    // if (MC.startsWith(prefix + "rappel")){
    //   if(BooleanAdmin(AuthorID)==true){
    //       Messagerappel(Botrappel, TODOBotReaction, idrole);
    //   } 
    //   else {
    //     MessageInsufficientAuthority(AuthorID,BotChan);
    //   }
    // }

    // donne l'adresse du site internet de gestion
    // if (MC.startsWith(prefix + "gdoc")){
    //   MessageGdoc(AuthorID,BotChan);
    // }

    // commande /lvl (4 caractéres)
    if (MC.startsWith(prefix + "lvl")) {
      if (MC.substring(4, MC.length) > 0) {
        var lvl = MC.substring(4, MC.length);
        updateLvl(AuthorID, lvl);
        Messagelvlok(AuthorID, BotChan, lvl);
      }
      else {
        Messagelvl(AuthorID, BotChan);
      }
    }

    // commande /level (6 caractéres)
    if (MC.startsWith(prefix + "level")) {
      if (MC.substring(6, MC.length) > 0) {
        var level = MC.substring(6, MC.length);
        updateLvl(AuthorID, level);
        Messagelvlok(AuthorID, BotChan, level);
      }
      else {
        Messagelvl(AuthorID, BotChan);
      }
    }

    // commande /influ (6 caractéres)
    if (MC.startsWith(prefix + "influ")) {
      if (MC.substring(6, MC.length) > 0) {
        var influ = MC.substring(6, MC.length).trim();
        updateInflu(AuthorID, influ);
        Messageinfluok(AuthorID, BotChan, influ);
      }
      else {
        Messagelvl(AuthorID, BotChan);
      }
    }

    // Commande de reset manuel des raids /raidreset, option "sc", "ac" et "raz"
    // if (MC.startsWith(prefix + "raidreset")) {
    //   if (BooleanAdmin(AuthorID) == true) {
    //     // option "SC" (sans calcul statistique)
    //     if (MC.includes("sc")) {
    //       Resetsc();
    //       MessageResetDataRaid(AuthorID, BotChan);
    //     }
    //     // option "ac" (avec calcul des statistiques)
    //     if (MC.includes("ac")) {
    //       Resetac();
    //       MessageResetDataRaid(AuthorID, BotChan);
    //     }
    //     // option "raz" (remise a 0 complet de la BD)
    //     if (MC.includes("raz")) {
    //       Resetraz();
    //       Messageraz(AuthorID, BotChanOfficier);
    //     }
    //   } else {
    //     MessageInsufficientAuthority(AuthorID, BotChan);
    //   }
    //   message.delete();
    // }

    // Commande d'allumage ou d'extinction des fonction automatique cron /raid option "on" et "off"
    if (MC.startsWith(prefix + "raid")) {
      if (Booleanusermp(AuthorID) == true) {
        // option "on" (mise en service des fonctions automatique cron)
        if (MC.includes("on")) {
          updateActivationBot(0)
          console.log("Allumage raid = on");
          MessageRaidon(AuthorID, BotChan);
        }
        // option "off" (arret des fonctions automatique cron)
        if (MC.includes("off")) {
          updateActivationBot(1)
          console.log("Allumage raid = off");
          MessageRaidoff(AuthorID, BotChan);
        }
      }
      else {
        MessageInsufficientAuthority(AuthorID, BotChan);
      }
      message.delete();
    }

    // commande /data (Embled des infos du joueur)
    if (MC.startsWith(prefix + "data")) {
      await EmbedData(BotChan, message);
    }

    // commande /guide (Embled des infos du jeux)
    if (MC.startsWith(prefix + "guide")) {
      EmbedGuide(BotChan, message);
    }

    // Assignement de la classe de héros joué /class
    if (MC.startsWith(prefix + "class")) {
      cmdclass(AuthorID, MC.substring(6, MC.length).trim(), BotChan);
    }

    // Liste des joueurs non inscrit a la prochaine au GvG /gvg (NextRaid = 0)
    if (MC.startsWith(prefix + "gvg")) {
      const unregisteredlist = await unregisteredList();
      Messagegvg(AuthorID, BotChanOfficier, unregisteredlist);
    }

    // Rappel d'inscription GvG en mp
    if (MC.startsWith(prefix + "mp")) {
      if (Booleanusermp(AuthorID) == true) {
        if (MC.substring(3, MC.length) > 0) {
          var userpourmp = MC.substring(3, MC.length).trim();
          var privatemessage = await client.users.fetch(userpourmp);
          var changvg = TODOchangvg;
          var utilisateurofficier = TODOutilisateurofficier;
          privatemp(privatemessage, changvg, utilisateurofficier);
          Messageprivatemp(AuthorID, BotChanOfficier, userpourmp);
          message.delete();
        }
      }
      else {
        MessageInsufficientAuthority(AuthorID, BotChan);
      }
    }

    // reset manuel du message de reaction d'inscription GvG
    if (MC.startsWith(prefix + "resetmsggvg")) {
      if (Booleanusermp(AuthorID) == true) {
        cmdresetmsggvg(BotReaction, TODOBotReaction);
        // Resetsc();
      }
      else {
        MessageInsufficientAuthority(AuthorID, BotChan);
      }
    }
  }
});

// Fonction automatique "Cron"
function TaskHandle(BotReaction, TODOBotReaction, idrole) {
  // Fonction automatique de check des presences discord pendant la GvG
  var checkPresence = new CronJob('0 */1 20 * * 2,6', function () {
    cronCheckpresence(idCategorie);
  }, null, true, 'Europe/Paris');
  checkPresence.start();

  // fonction de changement automatique du message de réaction à 21h mardi et samedi
  var resetmsgreact = new CronJob('0 0 21 * * 2,6', function () {
    cronResetMsgReaction(BotReaction, TODOBotReaction, idrole);
  }, null, true, 'Europe/Paris');
  resetmsgreact.start();
} 
