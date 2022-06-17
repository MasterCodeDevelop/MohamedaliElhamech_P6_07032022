
// modules bcrypt et jsonwebtoken
const bcrypt = require('bcrypt'),
jwt = require('jsonwebtoken'),
User = require('../models/User');

// Création de nouveau compte d'utilisateur 
exports.signup = (req, res, next) => {
    const password = req.body.password,
    RegPass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    //vérifier les condition du mot de passe
    if(RegPass.test(password) == false){
        return res.status(401).json({ message: "Le mot de passe doit comporter 8 caractères ou plus dont 1 lettre minuscule et majuscule, 1 nombre et 1 caractère spécial" });
    }

    //crypter le mot de passe
    bcrypt.hash(password, 10)
        .then(hash => {
            // Création du nouvel utilisateur
            const user = new User({
                email: req.body.email,
                password: hash
            });

            // Enregistrement de l'utilisateur dans la base de données          
            user.save()
                .then(() => res.status(201).json({  message: "L\'utilisateur a été créé avec succès" }))
                .catch(error => res.status(401).json({ error, message: "Cet email est déjà utilisé, merci de choisir un autre" }));
        })
        .catch(error => res.status(500).json({ error }));
};

//Connexion au compte de l'utilisateur 
exports.login = (req, res, next) => {

    // Chercher l'utilisateur dans la base de données
    User.findOne({ email: req.body.email })
        .then(user => {

            // Si l'tilisateur n'est pas trouvé
            if (!user) {
                return res
                    .status(401).
                    json({  message: 'Ce compte n\'exsiste pas'});
            }

             
            /** 
             *  Si l'tilisateur est trouvé
             * 
             * Comparaison du mot de passe envoyé par l'utilisateur qui essai de 
             * se connecter avec le hash qui est enregistré dans la base de données.
             * 
             */
            bcrypt.compare(req.body.password, user.password)
                .then( valid => {
                    // Si valid = false, le mot de passe ne correspond pas alors retourne  401...
                    if (!valid) {
                        return res.status(401).json({ message: 'le mot de passe incorrect' });
                    }

                    // Si non , Le mot de passe correspond
                    res.status(200).json({
                        userId: user._id, // Identifiant de l'utilisateur dans la base
                        token: jwt.sign({ userId: user._id },'${process.env.TOKEN}',{ 
                            expiresIn: '24h' // expirartion de tokent 24 heures
                        })
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};