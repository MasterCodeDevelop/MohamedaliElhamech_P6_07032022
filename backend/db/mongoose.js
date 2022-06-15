
// connexion à la base de donnée
const mongoose = require('mongoose');

/**
 * récupération des informations de la base de donée depuis la variable d'environement dans le fichier .eenv
 * 
 * DB_USER = "utilsateur"
 * DB_PASSWORD = "mot de passe",
 * DB_NAME= "nom de la base de donée"
 * 
 */
const db = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME
}

mongoose.connect(`mongodb+srv://${db.user}:${db.password}@cluster0.hvloi.mongodb.net/${db.name}?retryWrites=true&w=majority`,
  { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
  }
)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));
