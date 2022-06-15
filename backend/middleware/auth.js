// Récupération du modèle jsonwebtoken
const jwt = require('jsonwebtoken');

// AUTHENTIFICATION 
module.exports = (req, res, next) => {
  try {
    // Récupération du token dans le header authorization de 'En-tête de requête'
    const token = req.headers.authorization.split(' ')[1];

    // Décoder le token 
    // jwt.verify(token à vérifier, clé d'encodage);
    const decodedToken = jwt.verify(token, '${process.env.TOKEN}');

    // Extraire le 'userId' qui est à l'intérieur du token décodé
    const userId = decodedToken.userId;

    // Ajout de auth  dans la requette
    req.auth = { userId };


    // Vérification de la concordance, si l 'userId' de la requête correspond à celui du token
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID non valable !';
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | 'Requête non authentifiée !' });
  }
};