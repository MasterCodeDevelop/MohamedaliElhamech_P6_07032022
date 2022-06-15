// imports
const Sauce = require("../models/Sauces"),
fs = require("fs");

/******************  CREER UNE SAUCE  *********************/
exports.createSauce = (req, res, next) => {
  // Transforme la chaîne de caractère en objet
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;

  // Création d'un nouvelle sauce
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  // Affichage du résultat dans la console
  console.log(sauce);

  // Enregistrement de la sauce dans la base de données
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

/*******************  VOIT UNE SAUCE  **********************/
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id,})
    .then( sauce => res.status(200).json(sauce))
    .catch( error => res.status(404).json({error}) );
};

/******************  MODIFIER UNE SAUCE  *********************/
exports.modifySauce = (req, res, next) => {

  // S'il y a la présence ou non de 'request.file'.
  if (req.file) {
    //Récupération de la sauce dans la base de données si elle existe
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        // Récupération du nom de la photo à supprimer dans la base de données
        const filename = sauce.imageUrl.split("/images/")[1];

        // Suppression de l'image dans le dossier 'images' du serveur
        fs.unlink(`images/${filename}`, () => {

          // nouvelle donées de la sauce
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          };

        /**
         * Mise à jour de la base de données
         * Argument 1 : Objet de comparaison '_id' doit être le même que le paramètre de requête
         * Argument 2 : nouvel objet
         */
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(500).json({ error }));
  
  // S'il n'y a la présence ou non de 'request.file'.
  } else {
    // nouvelle donées de la sauce

    /**
     * Mise à jour de la base de données
     * Argument 1 : Objet de comparaison '_id' doit être le même que le paramètre de requête
     * Argument 2 : nouvel objet
     */
    Sauce.updateOne(
      { _id: req.params.id },
      { ...JSON.parse(req.body.sauce), _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

/******************  SUPRIMER UNE SAUCE  *********************/
exports.deleteSauce = (req, res, next) => {
  // Chercher la sauce dans la base de données avec le même  '_id' que le paramètre de requête 
  Sauce.findOne({ _id: req.params.id })
    // Récupération de la sauce dans la base de données
    .then((sauce) => {

      // Vérification que la sauce appartient à la personne qui effectue la requête
      if (sauce.userId !== req.auth.userId) {
        return response.status(401).json({
          error: new Error("Requête non autorisée !"),
        });
      }

      // Récupération du nom du fichier à supprimer
      const filename = sauce.imageUrl.split("/images/")[1];

      //Suppression de ce fichier avec la methode 'unlink' du package 'fs'
      fs.unlink(`images/${filename}`, () => {
        // Suppression de la sauce dans la base de données avec le même  '_id' que le paramètre de requête 
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })

    // La sauce n'existe pas dans la base de données
    .catch((error) => res.status(500).json({ error }));
};

/*****************  VOIR TOUTE LES SAUCES  *********************/
exports.getAllSauce = (req, res, next) => {

  // Récupération des données de toutes les sauces
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

/*****************  LIKE/DISLIKE SAUCE  *********************/
exports.likeSauce = (req, res) => {
  const like = req.body.like;

  //Like une sauce 
  if (like === 1) {
    Sauce.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
    )
      .then(() => res.status(200).json({ message: "Like ajouté !" }))
      .catch((error) => res.status(400).json({ error }));

  // Dislike de la sauce
  } else if (like === -1) {
    Sauce.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
    )
      .then(() => res.status(200).json({ message: "Dislike ajouté !" }))
      .catch((error) => res.status(400).json({ error }));

  //L'utilisateur annule son like
  } else {
      Sauce.findOne({ _id: req.params.id }).then((resultat) => {
        //annulé le like 
        if (resultat.usersLiked.includes(req.body.userId)) {
          Sauce.findOneAndUpdate(
            { _id: req.params.id },
            { 
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId }
            }
          )
          .then(() => res.status(200).json({ message: "like retiré !" }))
          .catch((error) => res.status(400).json({ error }));    
        } 

        //annulé le dislike 
        else if (resultat.usersDisliked.includes(req.body.userId)) {
          Sauce.findOneAndUpdate(
            { _id: req.params.id },
            { 
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId }
            }
          )
          .then(() => res.status(200).json({ message: "dislike retiré !" }))
          .catch((error) => res.status(400).json({ error }));
        }
    });
  }
};
