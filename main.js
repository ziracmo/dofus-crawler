/**
 * Created by Alexandre on 28/07/2017.
 */
const si = require('scrape-it');
const _ = require('lodash');
const firebase = require('firebase');
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
        saveClasses(db);
    });

/**
 * Save the existing classes on the dofus thanks to the site data
 * @param db the firebase database to save the data
 */
const saveClasses = (db) => {
    si("https://www.dofus.com/fr/mmorpg/encyclopedie/classes", {
        title: "h1.ak-return-link",
        classes: "span.ak-text"
    }).then(page => {
        const classes = {};
        _.split(page.classes, /\r?\n/)
            .map(value => value.trim())
            .forEach((value, index) => {classes[index] = value});
        db.ref('/classes').set(classes).then(() => console.log('Classes saved'))
    });
};



