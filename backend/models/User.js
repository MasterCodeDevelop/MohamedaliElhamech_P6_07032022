const mongoose = require('mongoose'); // Importation du package 'mongoose'


// uniqueValidator empeche la création de deux comptes avec le même email
const uniqueValidator = require('mongoose-unique-validator');

// Shéma de données
const userSchema = mongoose.Schema({
  email: { 
    type: String,
    required: true,
    unique: true // 'unique: true' signifie que deux utilisateurs ne pourront pas partager la même adresse mail
  },
  password: { 
      type: String,
      required: true
  }
});

// uniqueValidator assure que deux utilisateurs ne puissent partager la même adresse e-mail.
userSchema.plugin(uniqueValidator);

// exports
module.exports = mongoose.model('User', userSchema);