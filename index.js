const express = require("express");
const cors = require("cors");

const app = express(); 
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is running !");
}); 

const PORT = 3000;
app.listen(PORT, () => {
    console.log("serveur lancé sur http://localhost:${PORT}");
});