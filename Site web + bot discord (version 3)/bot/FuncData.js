// fichier annexe
import { ServerID, client } from './Constant.js';
import { CreateOrUpdateUser } from './database.js';

// fonction de creation et de mise a jour d'un utilisateur de la base de donnée lowdb
export async function PlayerCreateOrUpdate(MemberID) {
  // Récupération des infos serveur
  let serv = await client.guilds.fetch(ServerID);
  // Récupération des infos du joueur ayant l'id "MemberID"
  let guildMember = await serv.members.fetch(MemberID);
  let MemberHightestRole = guildMember.roles.highest;
  let MemberHightestRoleName = MemberHightestRole.name;
  if (MemberHightestRoleName == "@everyone") {
    MemberHightestRoleName = "pas de role spécifique";
  }

  // console.log('\n\nUser info :\n', guildMember);
  
  // data pour la requete sql
  const data = {
    DiscordID: MemberID,
    DiscordName: guildMember.displayName,
    DiscordBaseName: guildMember.user.username,
    DiscordRole: MemberHightestRoleName,
    DiscordPhoto: guildMember.user.avatarURL(),
  };

  await CreateOrUpdateUser(data);
}
