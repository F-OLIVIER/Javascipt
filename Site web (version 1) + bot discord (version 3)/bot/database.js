// module nodejs et npm
import sqlite3 from 'sqlite3';

export async function CreateOrUpdateUser(data) {
    const db = new sqlite3.Database('../database/databaseGvG.db');
    const sql = "SELECT DiscordID FROM Users WHERE DiscordID = ?";

    db.all(sql, [data.DiscordID], (err, rows) => {
        if (!err) {
            if (rows && rows.length > 0) {
                // Utilisateur existant, effectuer la mise à jour
                const updateQuery = `UPDATE Users SET DiscordName = ?, DiscordBaseName = ?, DiscordRole = ?, DiscordPhoto = ? WHERE DiscordID = ?;`;
                db.run(updateQuery, [data.DiscordName, data.DiscordBaseName, data.DiscordRole, data.DiscordPhoto, data.DiscordID], function (error) {
                    if (error) {
                        console.error(error.message);
                    }
                });
            } else {
                // Utilisateur inexistant, effectuer l'insertion
                const insertQuery = `INSERT INTO Users (DiscordID, DiscordName, DiscordBaseName, DiscordRole, DiscordPhoto, GameCharacter_ID, Lvl, EtatInscription, NbEmojiInscription, TrustIndicator, Influence, MNDR, NbGvGParticiped, NbTotalGvG, DateLastGvGParticiped) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
                db.run(insertQuery, [data.DiscordID, data.DiscordName, data.DiscordBaseName, data.DiscordRole, data.DiscordPhoto, 0, 0, -1, 0, 0, 700, 0, 0, 0, "jamais / never"], function (err) {
                    if (err) {
                        console.error(err.message);
                    }
                });
            }
        } else {
            console.error(err.message);
        }

        db.close();
    });
}

export async function userInfo(user_id) {
    const db = new sqlite3.Database('../database/databaseGvG.db');

    return new Promise((resolve, reject) => {
        const selectQuery = `
            SELECT DiscordID, DiscordName, DiscordRole, DiscordPhoto,
                   Lvl, Influence, EtatInscription, NbGvGParticiped, NbTotalGvG, GameCharacter_ID, DateLastGvGParticiped
            FROM Users
            WHERE DiscordID = ?;
        `;

        db.get(selectQuery, [user_id], (err, row) => {
            db.close();

            if (err) {
                console.error(err.message);
                reject(err);
                return;
            }

            if (row) {
                resolve(row);
            }
        });
    });
}

export async function classPlay(idClass) {
    const db = new sqlite3.Database('../database/databaseGvG.db');
    const getclassPlay = async () => {
        return new Promise((resolve, reject) => {
            const requestQuery = `SELECT ClasseFR, ClasseEN FROM ListGameCharacter WHERE ID = ?;`;
            db.all(requestQuery, idClass, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };
    const classPlay = await getclassPlay();
    db.close();
    return classPlay[0].ClasseFR + ' / ' + classPlay[0].ClasseEN;
}

export async function unregisteredList() {
    const db = new sqlite3.Database('../database/databaseGvG.db');
    const getUnregisteredUsers = async () => {
        return new Promise((resolve, reject) => {
            const requestQuery = `SELECT DiscordID FROM Users WHERE EtatInscription = 0;`;
            db.all(requestQuery, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    const list = await getUnregisteredUsers();
    db.close();
    let discordNamesList = "";
    for (let i = 0; i < list.length; i++) {
        discordNamesList += "<@" + list[i].DiscordID + ">";
        if (i !== list.length - 1) {
            discordNamesList += ", ";
        }
    }

    return discordNamesList;
}

// ------------------------------------------------------------
// --------------- mise à jour de l'utilisateur ---------------
// ------------------------------------------------------------

export function updateLvl(AuthorID, lvl) {
    const db = new sqlite3.Database('../database/databaseGvG.db');
    const updateQuery = `UPDATE Users SET Lvl = ? WHERE DiscordID = ?;`;
    db.run(updateQuery, [lvl, AuthorID],
        function (error) {
            if (error) throw error;
        }
    );
    db.close();
}

export function updateInflu(AuthorID, influ) {
    const db = new sqlite3.Database('../database/databaseGvG.db');
    const updateQuery = `UPDATE Users SET Influence = ? WHERE DiscordID = ?;`;
    db.run(updateQuery, [influ, AuthorID],
        function (error) {
            if (error) throw error;
        }
    );
    db.close();
}

// ------------------------------------------------------------
// ------------- mise à jour de la gestion du bot -------------
// ------------------------------------------------------------

export function updateIdMessage(newMessageId) {
    const db = new sqlite3.Database('../database/databaseGvG.db');
    const updateQuery = `UPDATE GestionBot SET IDMessageGvG = ? WHERE ID = 1;`;
    db.run(updateQuery, newMessageId,
        function (error) {
            if (error) throw error;
        }
    );
    db.close();
}

// option 0 = on, option 1 = off
export function updateActivationBot(option) {
    const db = new sqlite3.Database('../database/databaseGvG.db');
    const updateQuery = `UPDATE GestionBot SET Allumage = ? WHERE ID = 1;`;
    db.run(updateQuery, option,
        function (error) {
            if (error) throw error;
        }
    );
    db.close();
}

export function botOn(message_id) {
    const db = new sqlite3.Database('../database/databaseGvG.db');
    const selectQuery = `SELECT IDMessageGvG FROM GestionBot WHERE ID = 1;`;

    return new Promise((resolve, reject) => {
        db.get(selectQuery, (err, row) => {
            db.close();
            if (err) {
                console.log("err botOn : ", err);
                reject(err);
            } else {
                if (row && row.IDMessageGvG === message_id) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    });
}