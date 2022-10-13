const express = require('express');
// creation d'un routeur avec la méthode Router d'express
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


const saucesCtrl = require('../controllers/sauces');

// appeler auth avant le gestionnaire de route pour qu'il puisse être utilisé
router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
// router.post('/', auth, saucesCtrl.imgSauces);
// router.post('/:id/like', auth, saucesCtrl.likeSauce);


module.exports = router;