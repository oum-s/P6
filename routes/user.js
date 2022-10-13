const express = require('express');
const router = express.Router();
// controlleur qui associe les fonctions aux différentes routes
const userCtrl = require('../controllers/user');
// routes post car le frontend enverra les informations
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;