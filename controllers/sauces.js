const Sauce = require('../models/Sauce');
const fs = require('fs'); 

// finir la modif
exports.createSauce = async (req, res, next) => {
   // on doit parser l'objet requete à l'aide de la fonction parse
   const sauceObject = await JSON.parse(req.body.sauce);
   // on supprime les id pour empêcher les personnes mal intentionné de pouvoir créer un objet avec l'id de quelqu'un d'autre
   delete sauceObject._id;
   delete sauceObject._userId;
   const sauce = new Sauce({
       ...sauceObject,
       userId: req.auth.userId,
       // génerer l'url de l'image
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   });
 
   sauce.save()
   .then(() => { res.status(201).json({message: 'Sauce enregistré !'})})
   .catch(error => { res.status(400).json( { error })})
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id })
  .then((sauce) => {res.status(200).json(sauce);})
  .catch((error) => {res.status(404).json({error: error});});
};

exports.modifySauce = (req, res, next) => {
  // verifier s'il y a un champ file dans mon objet
  const sauceObject = req.file ? {
    // si oui on le récup en parsan, sinon récupérer l'objet direct dans le corps de la requête
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  // mesure de sécurité
  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
        // on vérifie qu'il appartient bien à l'utilisateur qui nous demande la modification
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

exports.deleteSauce = (req, res, next) => {
  // on récupère l'objet en base
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
        // verification de sécurité
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
            // on récupère le nom de fichier autour du répértoir image
              const filename = sauce.imageUrl.split('/images/')[1];
              // méthode unlink de fs permet de supprimer
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then((sauces) => {res.status(200).json(sauces);})
  .catch((error) => {res.status(400).json({error: error});});
};

exports.likeSauce = async (req, res, next) => {
  // déclare sauce sélectionné 
  let sauce = await Sauce.findOne({ _id: req.params.id });
    // si il n'y a pas de sauces trouvé 
    if ( sauce == false ){
      res.status(404).json({message: 'Sauce inexistante !'})
      return
    }

    //ajout like
    if(req.body.like === 1 ){
      //si l'utilisateur n'a pas liké ou disliké la sauce, car on ne peux pas liker ET disliker en même temps
      if ( !sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId) ){
        //on update
        Sauce.updateOne({ _id: req.params.id}, {
          //incremente un like 
          $inc : { likes : 1 } ,
          // ajoute la valeur 1 like par l'utilisateur à la sauce ds usersLiked
          $push : { usersLiked : req.body.userId }
        })
        .then(() => res.status(201).json({message : 'Vous avez liké la sauce !'}))
        .catch(error => res.status(400).json({ error }));

      }else{
        res.status(401).json({ message : 'Sauce déjà liké'});
      }
    // sinon, on dislike
    }else if (req.body.like === -1){
      //si l'utilisateur n'a pas liké ou disliké la sauce, car on ne peux pas liker ET disliker en même temps
      if ( !sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId) ){
        //on update
        Sauce.updateOne({ _id: req.params.id}, {
          //incremente un like 
          $inc : { dislikes : 1 } ,
          //ajoute la valeur 1 dislike par l'utilisateur à la sauce ds usersdisLiked
          $push : { usersDisliked : req.body.userId }
        })
        .then(() => res.status(200).json({message : 'Vous avez disliké la sauce !'}))
        .catch(error => res.status(401).json({ error }));
      //sinon : 
      }else{
        res.status(401).json({ message : 'Sauce déjà disliké'});
      }
    //annuler le like ou dislike
    }else if (req.body.like === 0){
      //si l'utilisateur a liké la sauce
      if( sauce.usersLiked.includes(req.body.userId) ){
          Sauce.updateOne({_id: req.params.id},{
            //on retire un like 
            $inc : { likes: -1 },
            //on supprime le tableau
            $pull : { usersLiked : req.body.userId}
          })
          .then(() => res.status(201).json({ message: "Vous avez annulé votre like" }))
          .catch(error => res.status(400).json({ error }));
      }

      if( sauce.usersDisliked.includes(req.body.userId) ){
        Sauce.updateOne({_id: req.params.id},{
          //on retire un like 
          $inc : { dislikes: -1 },
          //on supprime le tableau
          $pull : { usersDisliked : req.body.userId}
        })
        .then(() => res.status(201).json({ message: "Vous avez annulé votre dislike" }))
        .catch(error => res.status(400).json({ error }));
      }
    }
}