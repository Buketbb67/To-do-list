const sqlite3 = require("sqlite3").verbose();

// création base de données
const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.error("Erreur à l'ouverture de la db", err.message);
    } else {
        console.log("connexion okay à la db");
    }
});

// création table todos 

db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0)`, 
    (err) => {

        if (err) {
            console.log("erreur lors de la création de la table todos", err.message);
        } else {
            console.log("table todos créée ou déjà existante");
        }
    }
);

module.exports = db;