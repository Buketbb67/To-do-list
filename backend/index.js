const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Nouvelle requête reçue : ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("API is running !");
});

// route GET pour récupérer tous les todos 
app.get("/todos", (req, res) => {
  console.log("Route /todos appelée !");
  const sql = "SELECT * FROM todos";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "erreur serveur" });
    }
    res.json(rows);
  });
});

// route POST pour ajouter un todo
app.post("/todos", (req, res) => {
    // on récupère le titre envoyé en json par le front
    const{ title } =  req.body;

    if (!title) {
        return res.status(400).json({error: "il faut un titre pour creer une nouvelle tâche" });
    }

    // execution requête sql pour insérer la nouvelle tâche 
    const sql = "INSERT INTO todos (title) VALUES (?)";
    db.run(sql, [title], function(err) {
        if(err) {
            console.error(err.message);
            return res.status(500).json({erros: "erreur serveur"});
        }
    
    const newTodo = {
        id: this.lastID,
        title,
        completed: 0,
    };
    // on renvoie la tâche crée en json 
    res.status(201).json(newTodo);
    });
});

// route PUT pour modifier une tâce de la to do list 
app.put("/todos/:id", (req, res) => {
    // on récup ici les paramètres de l'url 
    const {id} = req.params;
    const {title, completed } = req.body;

    // si le titre de la tâche n'est pas défini et pareil pour completed on revnoi une erreur
    if (title === undefined && completed === undefined) {
        return res.status(400).json({ erros: "aucune donnée à modifier"});
    }

    const sql = `
        UPDATE todos
        SET
        title = COALESCE(?, title),
        completed = COALESCE(?, completed)
        WHERE id = ?
    `;

    db.run(sql, [title, completed, id], function (err) {
        if(err){
            console.error(err.message);
            return res.status(500).json({ error: "erreur serveur" });
        }
    // this.changes quand c'est à 0 cela signifie que aucune logne n'a été affectée par la requête
        if (this.changes === 0){
        return res.status(404).json({ error: "todo non trouvé"});
    }

    db.get(
        "SELECT * FROM todos WHERE id = ?",
        [id],
        (err, row) => {
          if (err) {
            return res.status(500).json({ error: "Erreur serveur" });
          }
          res.json(row);
        });
    });
});

// route DELETE pour supprimer une tâche 
app.delete("/todos/:id", (req, res) => {
    const {id} = req.params;

    const sql= "DELETE FROM todos WHERE id = ?";

    db.run(sql, [id], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error : "erreur serveur"});
        }

        if (this.changes === 0){
            return res.status(404).json({ error: "toto non trouvée"});
        }

        res.json({message : "todo supprimée"});
    });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
