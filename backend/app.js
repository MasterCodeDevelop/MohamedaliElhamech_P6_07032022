// IMPORTS
const express = require('express'),
authRoutes = require('./routes/auth');

const app = express();  

app.use((req, res, next) => {
    // Permet d'accéder l'API depuis n'importe quelle origine ('*')
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Permet d'ajouter les headers mentionnés aux requêtes envoyées vers l'API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');

    // Permet d'envoyer des requêtes avec les méthodes mentionnées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    // Renvoie au prochain Middleware
    next();
});

app.get('/', (req, res) => {
    res.send('Master Code Develop MA');
});

// Enregistrement du 'router' pour toutes les demandes effectuées
app.use('/api/auth', authRoutes);


// EXPORTS
module.exports = app;