const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
// fonction diskStorage pour dire qu'on va l'enregistrer sur le disque
const storage = multer.diskStorage({
  // dit dans quelle dossier il sera enregistré
  destination: (req, file, callback) => {
    // null=pas d'erreur et dossier images
    callback(null, 'images');
  },
  // explique à multer quel nom de fichier est utilisé 
  filename: (req, file, callback) => {
    // on utilise le nom d'origine et on élimine les espaces pour les remplacer par des _ pour pas avoir de pb
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    // arg1 : firename entier , la date actuel et l'extension du fichier
    callback(null, name + Date.now() + '.' + extension);
  }
});
// single: fichier unique et pas plusieurs fichier
module.exports = multer({storage: storage}).single('image');