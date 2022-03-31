const Sauce = require("../models/Sauces");
const fs = require("fs");

// Ajout d'une sauce dans la base de donnée
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Récupération des données d'une seul sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

// Modification de la sauce
exports.modifySauce = (req, res, next) => {
  if (req.file) {
    console.log("if");
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          };
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    console.log("else");
    const sauceObject = { ...req.body };
    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

// Suppression de la sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Récupération des données de toutes les sauces
exports.getAllSauce = (req, res, next) => {
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

// Ajout des likes et dislikes pour chaque sauce
exports.likeSauce = (req, res) => {
  /* Like de la sauce */
  if (req.body.like === 1) {
    Sauce.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
    )
      .then(() => res.status(200).json({ message: "Like ajouté !" }))
      .catch((error) => res.status(400).json({ error }));

    /* dislike de la sauce */
  } else if (req.body.like === -1) {
    Sauce.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
    )
      .then(() => res.status(200).json({ message: "Dislike ajouté !" }))
      .catch((error) => res.status(400).json({ error }));

    
  } else {
      Sauce.findOne({ _id: req.params.id }).then((resultat) => {
        /* annulé le like */
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

        /* annulé le dislike */
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
