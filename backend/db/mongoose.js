
// connexion à la base de donnée
const mongoose = require('mongoose');

const db = {
    user: "master2022",
    password: "master2022",
    name: "piiquante"
}

mongoose.connect(`mongodb+srv://${db.user}:${db.password}@cluster0.hvloi.mongodb.net/${db.name}?retryWrites=true&w=majority`,
  { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
  }
)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));
