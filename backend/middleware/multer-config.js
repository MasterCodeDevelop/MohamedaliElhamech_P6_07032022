// Récupération des images stockées sur le serveur

// Imports
const multer = require('multer');

// Types de fichiers acceptés
const MIME_TYPES = {
  'image/jpg': '.jpg',
  'image/jpeg': '.jpeg',
  'image/png': '.png'
};

// Définition du lieu de stockage
const storage = multer.diskStorage({
  // indiquer à 'multer' dans quel dossier il doit enregistrer les fichiers
  destination: (req, file, callback) => {
    // En argument 1 : 'null' pour dire qu'il n'y a pas eut d'erreur
    // En argument 2 : le dossier de destination
    callback(null, 'images');
  },

  // Définition du nom du fichier image
  filename: (req, file, callback) => {
    // Application de l'extension du fichier en utilisant des MIME_TYPES
    const extension = MIME_TYPES[file.mimetype];

    // Génération du nom du fichier
    const name = file.originalname.split(extension).join('_');

    // En argument 1 : 'null' pour dire qu'il n'y a pas eut d'erreur
    // En argument 2 : le nom de fichier entier
    callback(null, name + Date.now() + extension);
  }
});

// Exportation du middleware multer
module.exports = multer({storage: storage}).single('image');