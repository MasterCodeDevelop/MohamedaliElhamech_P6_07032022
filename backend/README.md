# PIIQUANTE #

 ## Back-end & Front-end: Prerequis ##
    Vous devez avoir Node and `npm` installés localement sur votre machine.

 ## BACKEND ##

  ### 1: DB | MONGOOSE : CONFIG ###
    mes informations pour connecter la base de donée sont caché dans le fichier .env pour de réson de sécuriter.
    Vous pouvez configurer votre base de donée en créeant un fichier .env dans la racine du dossier backend.
    Dans ce fichier vous mettez les informations de connection de votre base de donée mongoose comme l'exemple ci-dessous: 
        DB_USER = "le nom utilsateur"
        DB_PASSWORD = "votre mot de passe"
        DB_NAME = "le nom de votre base de donée"

  ### 2: IMAGES : DOSSIER ###
    Vous devez créer un dossier qui se nomme images dans la racine du dossier backend.

  ### 3: Back-end : Installation ###
    Dans le dossier "backend", éxécutez `npm install`. Vous pourrez ensuite lancer le serveur avec `node server`. 
    Le serveur est accessible sur `localhost` avec le port '3000' par défaut. Si le serveur devait s'exécuter sur un autre port, celui-ci serait indiqué dans la console : 'Listening on port *****'. 


 ## FRONTEND ##
    lien vers le repo du projet ici : https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6

    Le Front-end est fourni par OpenClassRooms. Seul le Back-end a été développé.

    Dans le dossier "frontend", éxécutez `npm install`. Vous pourrez ensuite lancer le serveur avec `npm start`. 
    Le serveur est accessible sur `localhost` avec le port '3001' par défaut. Si le serveur devait s'exécuter sur un autre port, celui-ci serait indiqué dans la console : 'Listening on port *****'. 