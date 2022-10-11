// on importe express
const express = require('express');
// on appelle la méthode express via app
const app = express();
// on utilise une fonction qui nous permet de renvoyer une réponse en json
// la fonction next permet de renvoyer à la prochaine fonction l'execution du serveur
app.use((req, res, next) => {

  console.log('Requête reçue !');
  // next permet d'envoyer vers la prochaine requête (donc le next)
    next();
});
// 
app.use((req, res, next) => {
  // on modifie le code de la réponse http
  //Le code de statut HTTP 201 Createdindique que la requête a réussi et qu'une ressource a été créée en conséquence.
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: 'Votre requête a bien été reçue !' });
  next();
});

app.use((req, res, next) => {
console.log('Réponse envoyée avec succès !');
});

// on exporte l'app pour pouvoir y accéder depuis les autres fichiers
module.exports = app;