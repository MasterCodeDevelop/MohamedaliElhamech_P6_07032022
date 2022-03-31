
// modules bcrypt et jsonwebtoken
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Création de nouveau compte d'utilisateur 
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(() => res.status(201).json({  message: "L\'utilisateur a été créé avec succès" }))
            .catch(error => res.status(401).json({ error, message: "Cet email est déjà utilisé, merci de choisir un autre" }));
        })
        .catch(error => res.status(500).json({ error }));
};

//Connexion au compte de l'utilisateur 
exports.login = (req, res, next) => {
    console.log('login')
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res
                    .status(401).
                    json({  message: 'Ce compte n\'exsiste pas'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'le mot de passe incorrect' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                        { userId: user._id },
                        '${process.env.TOKEN}',
                        { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};