const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   try {
      // on récupère le token : on recup le header et on le split pour récupérer le token 
       const token = req.headers.authorization.split(' ')[1];
      //  on lui passe le token recupérer et la clée secret
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       //on récupère le userId
       const userId = decodedToken.userId; 
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};