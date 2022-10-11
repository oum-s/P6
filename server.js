// objet http qui nous permet de créer un serveur 
const http = require('http');
// on importe le app.js
const app = require('./app');

// renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne 
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
// on dit à l'app sur quel port elle doit tourner
app.set('port', port);

// recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur ;
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// methode createServer prend comme argument la fonction qui sera appelé à chaque requête reçu par le serveur 
const server = http.createServer(app);

//un écouteur d'évènements est également enregistré, consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + addresss : 'port ' + port;
  console.log('Listening on ' + bind);
});
// le serveur est prêt et doit attendre les requêtes envoyé par la méthode listen, on utilise le port 3000 par def mais si elle est pas dispo on peut utiliser une variable de type environnement
server.listen(process.env.PORT || 3000);