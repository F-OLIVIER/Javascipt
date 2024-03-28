// module nodejs et npm
import moment from 'moment-timezone';
import sqlite3 from 'sqlite3';

export function Resetsc() {
  const db = new sqlite3.Database('../database/databaseGvG.db');
  const updateQuery = `UPDATE Users SET EtatInscription = 0, NbEmojiInscription = 0;`;

  db.run(updateQuery, function (error) {
    if (error) {
      console.error(error.message);
    }
  });

  deleteListGvG(db);
  db.close();
}

export function Resetraz() {
  const db = new sqlite3.Database('../database/databaseGvG.db');
  const updateQuery = `UPDATE Users SET EtatInscription = 0, NbEmojiInscription = 0, TrustIndicator = 0, NbGvGParticiped = 0;`;

  db.run(updateQuery, function (error) {
    if (error) {
      console.error(error.message);
    }
  });

  deleteListGvG(db);
  db.close();
}

export function Resetac() {
  // Obtenez la date actuelle avec le décalage horaire de Paris
  const futurdateformate = moment().tz("Europe/Paris");
  const jour = futurdateformate.day();
  const date = futurdateformate.date();
  const mois = futurdateformate.month();

  const db = new sqlite3.Database('../database/databaseGvG.db');

  const updateQuery = `
    UPDATE Users
    SET
      TrustIndicator = TrustIndicator + CASE 
                                WHEN MNDR >= 6 THEN 1
                                ELSE 0 END,
      DateLastGvGParticiped = CASE
                                WHEN EtatInscription IN (1, 2, 3) THEN ?
                                ELSE DateLastGvGParticiped
                              END,
      NbGvGParticiped = NbGvGParticiped + CASE
                                WHEN EtatInscription IN (1, 2, 3) THEN 1
                                ELSE 0
                              END,
      EtatInscription = 0,
      NbEmojiInscription = 0
    WHERE DiscordID = ?;
  `;

  const getAllUsers = async () => {
    return new Promise((resolve, reject) => {
      const selectQuery = `SELECT DiscordID FROM Users;`;
      db.all(selectQuery, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  };

  getAllUsers().then((users) => {
    for (const user of users) {
      db.run(updateQuery, [`${jour}/${date}/${mois}`, user.DiscordID], function (error) {
        if (error) {
          console.error(error.message);
        }
      });
    }
  }).catch((error) => {
    console.error(error);
  });

  deleteListGvG(db);
  db.close();
}

function deleteListGvG(db) {
  const sql = "DELETE FROM GroupeGvG";
  db.run(updateQuery, function (error) {
    if (error) {
      console.error(error.message);
    }
  });
}


export function MAJPresent(DiscordID) { // EtatInscription = 1
  const db = new sqlite3.Database('../database/databaseGvG.db');
  const sql = "SELECT NbEmojiInscription FROM Users WHERE DiscordID = ?";

  db.get(sql, [DiscordID], (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }

    if (row) {
      const updatedNbEmojiInscription = row.NbEmojiInscription + 1;
      const updateQuery = `UPDATE Users SET EtatInscription = 1, NbEmojiInscription = ? WHERE DiscordID = ?;`;
      db.run(updateQuery, [updatedNbEmojiInscription, DiscordID], function (error) {
        if (error) {
          console.error(error.message);
        }
      });
    }
  });
  db.close();
}

export function MAJRetard(DiscordID) { // EtatInscription = 2
  const db = new sqlite3.Database('../database/databaseGvG.db');
  const sql = "SELECT NbEmojiInscription FROM Users WHERE DiscordID = ?";

  db.get(sql, [DiscordID], (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }

    if (row) {
      const updatedNbEmojiInscription = row.NbEmojiInscription + 1;
      const updateQuery = `UPDATE Users SET EtatInscription = 2, NbEmojiInscription = ? WHERE DiscordID = ?;`;
      db.run(updateQuery, [updatedNbEmojiInscription, DiscordID], function (error) {
        if (error) {
          console.error(error.message);
        }
      });
    }
  });
  db.close();
}

export function MAJAbsent(DiscordID) { // EtatInscription = 3
  const db = new sqlite3.Database('../database/databaseGvG.db');
  const sql = "SELECT NbEmojiInscription FROM Users WHERE DiscordID = ?";

  db.get(sql, [DiscordID], (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }

    if (row) {
      const updatedNbEmojiInscription = row.NbEmojiInscription + 1;
      const updateQuery = `UPDATE Users SET EtatInscription = 3, NbEmojiInscription = ? WHERE DiscordID = ?;`;
      db.run(updateQuery, [updatedNbEmojiInscription, DiscordID], function (error) {
        if (error) {
          console.error(error.message);
        }
      });
    }
  });
  db.close();
}

export function removeInscription(DiscordID) {
  const db = new sqlite3.Database('../database/databaseGvG.db');
  const sql = "SELECT EtatInscription, NbEmojiInscription FROM Users WHERE DiscordID = ?";

  db.get(sql, [DiscordID], (err, row) => {
    if (err) {
      console.error(err.message);
      db.close();
      return;
    }

    if (row) {
      let updateQuery;
      let NbEmojiInscription = row.NbEmojiInscription - 1;
      let EtatInscription;

      if (NbEmojiInscription === 0) {
        EtatInscription = 0;
        updateQuery = `UPDATE Users SET EtatInscription = ?, NbEmojiInscription = ? WHERE DiscordID = ?;`;
        db.run(updateQuery, [EtatInscription, NbEmojiInscription, DiscordID], function (error) {
          if (error) {
            console.error(error.message);
          }
        });
      } else {
        updateQuery = `UPDATE Users SET NbEmojiInscription = ? WHERE DiscordID = ?;`;
        db.run(updateQuery, [NbEmojiInscription, DiscordID], function (error) {
          if (error) {
            console.error(error.message);
          }
        });
      }
    }
  });
  db.close();
}
