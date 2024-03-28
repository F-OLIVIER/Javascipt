// Fichier annexe
import { client, Messagegvg, privatemp, Messageprivatemp, MessageInsufficientAuthority, Booleanusermp, EmbedData, EmbedGuide } from './Constant.js';
import { createCommands, slashClass, slashInflu, slashLevel, slashResetmsggvg } from './slashcommand.js';
import { cronCheckpresence, cronResetMsgReaction } from "./Cronjob.js"
import { botOn, unregisteredList, isOfficier } from './database.js';
import { addReaction, removeReaction } from './Reaction.js';
import { PlayerCreateOrUpdate } from './FuncData.js';
import { cmdnb, cmdlist } from "./CommandBot.js";

// Module nodejs et npm
import { } from 'dotenv/config';
import { CronJob } from 'cron';

// --------------------------------------
// ------------- Adaptation -------------
// --------------------------------------

// id des chan (utilisateur, message reaction, message rappel, chan officier)
var TODOBotChan = '674275684364845057';
var TODOBotReaction = '1111983569900929024';
var TODOBotrappel = '674275684364845057';
var TODOBotChanOfficier = '715893349931810898';
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

// Afficher les erreurs
client.on('error', console.error);

// --------------------------------------------------------------
// ---------------------- Réaction message ----------------------
// --------------------------------------------------------------

// ajout d'une réaction
client.on("messageReactionAdd", async (reaction, user) => {
  if (user.bot) return;

  if (reaction.message.channel.id == TODOBotReaction && botOn(reaction.message.id)) {
    // Mise a jour du joueur dans la bd
    await PlayerCreateOrUpdate(user.id);
    // Ajout de la réaction
    await addReaction(reaction, user);
  }
});

// Supression d'une réaction
client.on("messageReactionRemove", async (reaction, user) => {
  if (user.bot) return;

  if (reaction.message.channel.id == TODOBotReaction && botOn(reaction.message.id)) {
    // Mise a jour du joueur dans la bd
    await PlayerCreateOrUpdate(user.id);
    // Retrait de la réaction
    await removeReaction(reaction, user);
  }
});

// --------------------------------------------------------------
// ----------------------- Activation bot -----------------------
// --------------------------------------------------------------

// definition des variables
const prefix = '/';
var BotChan;
var BotReaction;
var Botrappel;
var BotChanOfficier;

// definition des chan utilisé par le bot
client.on('ready', async () => {
  // création des slash commandes
  await createCommands();

  BotChan = client.channels.cache.get(TODOBotChan);
  BotReaction = client.channels.cache.get(TODOBotReaction);
  Botrappel = client.channels.cache.get(TODOBotrappel);
  BotChanOfficier = client.channels.cache.get(TODOBotChanOfficier);
  TaskHandle(BotChan, BotReaction, TODOBotReaction, Botrappel, TODOBotrappel, idrole, TODOusermpgetsaveBDD);

  // Message de confirmation du demarrage du bot dans la console
  console.log(`\n------------------------------\n----> Bot GvG LNB pret ! <----\n------------------------------\n`);
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
    if (message.author.bot) return; // Ignore les messages provenant d'autres bots

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
  }
});

// réponse au intéraction de message éphémére
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  interaction.ephemeral = true;

  // -------------------------------------------------------------------
  // ----------------------- Command utilisateur -----------------------
  // -------------------------------------------------------------------

  // interaction qui retourne l'embed data de l'utilisateur, Command /data
  if (interaction.commandName === "data") {
    interaction.reply({
      embeds: [await EmbedData(interaction)],
      ephemeral: true,
    });
    return true;
  }

  // interaction qui retourne l'embed guide de l'utilisateur, Command /data
  if (interaction.commandName === "guide") {
    interaction.reply({
      embeds: [await EmbedGuide()],
      ephemeral: true,
    });
    return true;
  }

  // interaction changement de level du héros, Command /lvl
  if (interaction.commandName === "lvl") {
    const valid = await slashLevel(interaction, AuthorID);
    return valid;
  }

  // interaction changement de l'influence du héros, Command /influ
  if (interaction.commandName === "influ") {
    const valid = await slashInflu(interaction, AuthorID);
    return valid;
  }

  // interaction changement de classe, Command /class
  if (interaction.commandName === "class") {
    const valid = await slashClass(interaction, AuthorID);
    return valid;
  }

  // interaction qui donne l'adresse du site internet associé au bot
  if (interaction.commandName === "site") {
    interaction.reply({
      content: "www.bon lien à mettre ici.com",
      ephemeral: true,
    });
    return true;
  }

  // -------------------------------------------------------------------
  // ---------------------- Command chan Officier ----------------------
  // -------------------------------------------------------------------

  if (interaction.commandName === "nombre_inscription_prochaine_gvg") {
    if (isOfficier(interaction.user.id)) {
      cmdnb(interaction.user.id, BotChanOfficier);
      interaction.reply({
        content: "Le nombre de joueur inscrit ou non à la prochaine GvG a été posté dans le canal <#" + TODOBotChanOfficier + ">",
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content: "Vous n'avez pas les autorisations nécéssaire pour réaliser cet action",
        ephemeral: true,
      });
    }
    return true;
  }

  if (interaction.commandName === "liste_inscrit") {
    if (isOfficier(interaction.user.id)) {
      cmdlist(interaction.user.id, BotChanOfficier);
      interaction.reply({
        content: "La liste des joueurs inscrit à la prochaine GvG a été posté dans le canal <#" + TODOBotChanOfficier + ">",
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content: "Vous n'avez pas les autorisations nécéssaire pour réaliser cet action",
        ephemeral: true,
      });
    }
    return true;
  }

  if (interaction.commandName === "non_inscrit_gvg") {
    if (isOfficier(interaction.user.id)) {
      const unregisteredlist = await unregisteredList();
      Messagegvg(interaction.user.id, BotChanOfficier, unregisteredlist);
      interaction.reply({
        content: "La liste des joueurs non inscrit à la prochaine GvG a été posté dans le canal <#" + TODOBotChanOfficier + ">",
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content: "Vous n'avez pas les autorisations nécéssaire pour réaliser cet action",
        ephemeral: true,
      });
    }
    return true;
  }

  // -------------------------------------------------------------------
  // ----------------------- Command admin du bot ----------------------
  // -------------------------------------------------------------------

  if (interaction.commandName === "raidreset") {
    const valid = await slashRaidReset(interaction);
    return valid;
  }

  if (interaction.commandName === "resetmsggvg") {
    const valid = await slashResetmsggvg(interaction);
    return valid;
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

