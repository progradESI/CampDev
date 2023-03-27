const express = require('express');
const router = express.Router();
const checkAuthenticated = require('../middlewares/checkAuthenticated');
const upload = require('../config/upload');
const { body } = require('express-validator');
const checkForValidationErrors = require('../middlewares/checkForValidationErrors');

const {
    createAccount,
    getAllAccounts
} = require('../controllers/admin');
const haveRole = require('../middlewares/haveRole');

router.post('/accounts',
    upload.single('photo'),
    checkAuthenticated,
    haveRole('ADMIN'),
    body('nom')
        .exists().withMessage('le nom est un attribut obligatoire')
        .isAlpha().withMessage('le nom ne doit contenir que des lettres')
        .isLength({
            min:1,
        }).withMessage('le nom doit contenir au moins une lettre')
        .isLength({
            max:30
        }).withMessage('le nom doit contenir au plus 30 lettres'),
    body('prenom')
        .exists().withMessage('le prénom est un attribut obligatoire')
        .isAlpha().withMessage('le prénom ne doit contenir que des lettres')
        .isLength({
            min:1,
        }).withMessage('le prénom doit contenir au moins une lettre')
        .isLength({
            max:30
        }).withMessage('le prénom doit contenir au plus 30 lettres'),
    body('dateDeNaissance')
        .exists().withMessage('date de naissance st un attribut obligatoire')
        .isDate().withMessage('la date de naissance est un date'),
    body('lieuDeNaissance')
        .exists().withMessage('lieu de naissance est un attribut obligatoire')
        .isLength({
            min:1,
        }).withMessage('le lieu de naissance doit contenir au moins une lettre')
        .isLength({
            max:50
        }).withMessage('le lieu de naissance doit contenir au plus 50 lettres'),
    body('etablissement')
        .exists().withMessage('etablissement est un attribut obligatoire')
        .isLength({
            min:1,
        }).withMessage("l'etablissement doit contenir au moins une lettre")
        .isLength({
            max:50
        }).withMessage("l'etablissement doit contenir au plus 40 lettres"),
    body('sexe')
        .exists().withMessage('sexe est un attribut obligatoire')
        .custom((value, { req }) => {
            console.log(value);
            if(value !== 'M' && value !== 'F') {
                throw new Error('sexe doit être "M" ou "F"')
            }
            return true;
        }).withMessage('sexe doit être "M" ou "F"'),
    body('motDePasse')
        .exists().withMessage("le mot de passe est un attribut obligatoire")
        .notEmpty().withMessage("le mot de passe est un attribut obligatoire")
        .isStrongPassword({
            minLength:8,
        }).withMessage("la longueur minimale des mots de passe est de huit")
        .isStrongPassword({
            minNumbers: 1
        }).withMessage("le mot de passe doit contenir au moins un chiffre")
        .isStrongPassword({
            minSymbols:1
        }).withMessage("le mot de passe doit contenir au moins un symbole"),
    body('email')
        .exists().withMessage("l'email est un attribut obligatoire")
        .notEmpty().withMessage("l'email est un attribut obligatoire")
        .isEmail().withMessage("adresse e-mail invalide"),
    body('numeroTelephone')
        .isNumeric().withMessage("numéro de téléphone n'est pas valide")
        .isLength({
            max: 10,
            min: 10
        }).withMessage("numéro de téléphone n'est pas valide"),
    checkForValidationErrors,
    createAccount
);

router.get('/accounts', 
    checkAuthenticated,
    haveRole('ADMIN'),
    getAllAccounts
);

module.exports = router;