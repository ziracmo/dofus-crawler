/**
 * Created by Alexandre on 28/07/2017.
 */

// IMPORT
const firebase = require('firebase');
const Nightmare = require('nightmare');
const nightmare = new Nightmare({ show: true });
const Classe = require('./src/classe')();


// Init the firebase application with the given credential in the firebase console
const app = firebase.initializeApp({
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId
});
// Authenticate with credentials existing in the firebase console
firebase.auth()
    .signInWithEmailAndPassword(process.env.email, process.env.password)
    .then(() => {
        // Link with the firebase database
        const db = app.database();
        Classe.save(nightmare, db);
    });


