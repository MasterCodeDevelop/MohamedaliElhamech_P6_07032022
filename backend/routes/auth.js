/********  Création de route de l'authentification des utilisateur 'user'   *********/

const express = require('express'),
router = express.Router();

router.get('', (req, res) => {
    res.status(201).json({ status: "201" })
})

module.exports = router;