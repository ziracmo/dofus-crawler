/**
 * Created by Alexandre on 30/07/2017.
 */

const _ = require('lodash');
const si = require('scrape-it');

const Classe = () => {

    // Declarations
    const dofusUrlEncycopedia = 'https://www.dofus.com/fr/mmorpg/encyclopedie/classes';

    const crawlingObject = {
        title: "div.ak-breed-long-name-text span",
        description: ".ak-breed-description",
        roles: '.ak-breed-roles-illu span',
        button: '.ak-btn-play-breed'
    };

    let numberOfClassesSaved = 0;

    // Privates methods

    const setSpeceBeforeUppercase = (str) => {
        return str.replace(/([A-Z])/g, ' $1').trim()
    };

    const saveNext = (nightmare, db) => {
        nightmare
            .click('.ak-arrow-right')
            .evaluate(() => window.location.href)
            .then(res => {
                si(res, crawlingObject)
                    .then(page => {
                        numberOfClassesSaved++;
                        const ngClasse = createClassFromPage(page);
                        // Save to the db
                        db.ref('/classes/' + ngClasse.name).set(ngClasse).then(() => {
                            if (numberOfClassesSaved < 18) {
                                saveNext(nightmare, db);
                            } else {
                                console.log('All class saved');
                            }
                        })
                    })
            })
    };

    const createClassFromPage = (page) => {
        const ngClasse = {};
        // Get the class name
        const split = _.split(page.button, ' ');
        ngClasse.name = split[split.length - 2];
        console.log('Classe name : ', ngClasse.name);
        // Get the class Role
        ngClasse.roles = _.split(setSpeceBeforeUppercase(page.roles), ' ');
        // Others
        ngClasse.description = page.description;
        ngClasse.title = page.title;
        return ngClasse;
    };


    const classe = {
        /**
         * Save the existing src on the dofus thanks to the site data
         * @param db the firebase database to save the data
         */
        save: (nightmare, db) => {
            nightmare.goto(dofusUrlEncycopedia)
                .click('div.ak-illu.ak-section-breed-6')
                .evaluate(() => window.location.href)
                .then(res => {
                    si(res, crawlingObject)
                        .then(page => {
                            const ngClasse = createClassFromPage(page);
                            // Save to the db
                            db.ref('/classes/' + ngClasse.name).set(ngClasse)
                                .then(() => {
                                    numberOfClassesSaved++;
                                    console.log(ngClasse.name + ' saved');
                                    saveNext(nightmare, db)
                                });
                        });
                })
        }
    };
    return classe;
};

module.exports = Classe;