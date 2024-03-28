// fichier annexe
import { ServerID, client } from './Constant.js';
import { CreateOrUpdateUser } from './database.js';

// --------------------------------------
// ------------- Adaptation -------------
// --------------------------------------

const nameRoleOfficier = "Officier";
const nameRoleUser = "Barbouse-Conqueror";

// -----------------------------------------------------------
// ---------------------- Coeur du code ----------------------
// -----------------------------------------------------------

// fonction de creation et de mise a jour d'un utilisateur de la base de donnée lowdb
export async function PlayerCreateOrUpdate(MemberID) {
  // Récupération des infos serveur
  let serv = await client.guilds.fetch(ServerID);
  // Récupération des infos du joueur ayant l'id "MemberID"
  let guildMember = await serv.members.fetch(MemberID);
  let allListRole = [];
  guildMember.roles.cache.forEach(role => {
    allListRole.push(role.name);
  });

  let CreateOrUpdateinDB = false;
  // check de la liste des roles discord pour garder le plus élevé pour les permissions du site internet
  let MemberRole = '';
  if (allListRole.includes(nameRoleOfficier)) {
    MemberRole = 'Officier';
    CreateOrUpdateinDB = true;
  } else if (allListRole.includes(nameRoleUser)) {
    MemberRole = nameRoleUser;
    CreateOrUpdateinDB = true;
  } else {
    MemberRole = "pas de role spécifique";
  }

  if (CreateOrUpdateinDB) {
    // data pour la requete sql
    const data = {
      DiscordID: MemberID,
      DiscordName: guildMember.displayName,
      DiscordBaseName: guildMember.user.username,
      DiscordRole: MemberRole,
      DiscordPhoto: guildMember.user.avatarURL(),
    };

    await CreateOrUpdateUser(data);
  }
}
