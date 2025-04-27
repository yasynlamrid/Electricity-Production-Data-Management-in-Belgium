const express = require("express"); // permet de recuperer le module express
const server = express();
const morgan = require("morgan");
const routeur = require("./routeur");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

mongoose.connect('mongodb://localhost/PowerBE')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée !', err));



server.use(express.static("public")) // cette ligne permet d'envoyer les fichiers existant dans le dossier public aux clients
server.use(morgan("dev"));
server.use(bodyParser.urlencoded({extended:false}));


server.use("/", routeur);
server.listen(3000);


