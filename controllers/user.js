// fichier controllers/user.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// fonction pour l'enregistrement de nos utilisateurs
exports.signup = (req, res, next) => {
  // fonction pour hacher et crypter un mp, 10 tours de l'algorithme
  //methode asynchrone donc then et catch requis
  bcrypt.hash(req.body.password, 10)
    // on récupère le mp hashé
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      // enregistre dans la bdd
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


// pour connecter les utilisateurs existants 
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
      .then(user => {
          if (!user) {
              return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
          }
          // on compare le mp de notre bdd et le mp donné par l'utilisateur
          bcrypt.compare(req.body.password, user.password)
              .then(valid => {
                  if (!valid) {
                      return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                  }//sinon
                  res.status(200).json({
                      userId: user._id,
                      // appeler une fonction de jwt token, 
                      token: jwt.sign(
                        // arg1 : données qu'on veut encoder à l'interieur du token
                        { userId: user._id },
                        // arg2 clé secrete pour l'encodage
                        'RANDOM_TOKEN_SECRET',
                        // arg3 : argument de configuration, chaque token durera 24h sinon il sera plus valable
                        { expiresIn: '24h' })
                  });
              })
              .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};
