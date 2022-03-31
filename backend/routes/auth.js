// Création de route de l'authentification des utilisateur 'user'

const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/login', userCtrl.login);
router.post('/signup', userCtrl.signup);

module.exports = router;